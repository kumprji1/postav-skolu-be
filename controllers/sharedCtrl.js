const mongoose = require("mongoose");
const Donatable = require("../models/Donatable");
const Donation = require("../models/Donation");

const LandPiece = require("../models/LandPiece");
const Order = require("../models/Order");
const Project = require("../models/Project");
const HttpError = require('../models/HttpError')
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY)

/**
 * Project
 */
exports.getProject = async (req, res, next) => {
  const { projectId } = req.params;
  Project.findById(projectId)
    .then((project) => {
      res.json(project);
    })
    .catch((err) => console.log(err));

}

exports.getProjectByCategory = (req, res, next) => {
  const { category } = req.params;
  Project.find({ category: category })
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => console.log(err));
};

exports.getProjectByTitle = (req, res, next) => {
  const { urlTitle } = req.params;
  Project.findOne({ urlTitle: urlTitle })
    .then((project) => {
      if (project) 
        res.json(project);
      else
      return next(new HttpError('Nepodařilo se načíst projekt (nejspíše špatný url)', 500))
    })
    .catch((err) => {
      return next(new HttpError('Nepodařilo se načíst projekt', 500))
    });
};


/**
 * Donatable
 */

exports.getDonatablesByProjectId = async (req, res, next) => {
  const projectId = req.params.projectId
  let donatables = []
  try {
    donatables = await Donatable.find({ projectId: projectId})
  } catch (err) {
    console.log(err);
  }
  res.json(donatables)
}

/**
 * Donations
 */

exports.getDonationsByDonatableId = async (req, res, next) => {
  let donations = []
  try {
    donations = await Donation.find({ donatableId: req.params.donatableId })
  } catch (err) {
    console.log(err)
  }
  res.json(donations)
}

/**
 * Order
 */
exports.postCreateOrder = async (req, res, next) => {
  const totalAmount = 
    req.body.donations.reduce((partSum, i) => partSum + i.price, 0) +
    req.body.products.reduce((partSum, i) => partSum + i.price, 0) 

  // const orderData
  // console.log(pieces);
  const donationsIDs = [];

  // Create Donations in DB
  for (const donation of req.body.donations) {

    let donName = ''
    if (donation.isAnonymous) {
      donName = 'Anonym'
    } else if (req.body.buyingAsCompany) {
      donName = req.body.companyInfo.title
    } else {
      donName = req.body.contact.name + ' ' + req.body.contact.surname
    }

    const newDonation = await new Donation({
      price: donation.price,
      donatableId: donation.donatableId,
      createdAt: new Date(),
      isPurchased: true,
      isAnonymous: donation.isAnonymous,
      note: donation.note,
      name: donName
    }).save();
    donationsIDs.push(newDonation._id);
  }

  // console.log(piecesIDs)
  const newOrder = new Order({
    contact: {
      name: req.body.contact.name,
      surname: req.body.contact.surname,
      email: req.body.contact.email,
      mobile: req.body.contact.mobile,
    },
    buyingAsCompany: req.body.buyingAsCompany,
    wantsCertificate: req.body.wantsCertificate,
    "companyInfo.title": req.body.companyInfo.title,
    "companyInfo.ico": req.body.companyInfo.ico,
    "companyInfo.dic": req.body.companyInfo.dic,
    "certificateInfo.street_num": req.body.certificateInfo.street_num,
    "certificateInfo.city": req.body.certificateInfo.city,
    "certificateInfo.zipCode": req.body.certificateInfo.zipCode,
    paymentMethod: req.body.paymentMethod,
    deliveryMethod: req.body.deliveryMethod,
    products: [],
    donations: donationsIDs,
    totalAmount: totalAmount,
    isPurchased: false,
    createdAt: new Date(),
  });
  await newOrder.save();

  // Stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'czk',
          product_data: {name: 'Darovat'},
          unit_amount: totalAmount * 100,
          tax_behavior: 'exclusive',
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/objednavka/${newOrder._id}?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/objednavka/${newOrder._id}?canceled=true`,
  });

  // set order purchased
  // Order.findByIdAndUpdate(newOrder._id, { isPurchased: true })


  res.json({ sessionUrl: session.url, message: 'Order created! ', orderId: newOrder._id })
  
  // res.json({message: 'Order created! ', orderId: newOrder._id})
  // lets PAYYY

};

/**
 * Experimental ↓↓↓
 */

exports.getFewLandPiecesO3 = async (req, res, next) => {
  try {
    const landPieces = await LandPiece.find();
    return res.json(landPieces);
  } catch (err) {
    console.log(err);
  }
};

exports.postBuyPieces = async (req, res, next) => {
  try {
    const piecesToBuy = req.body.landPiecesState.piecesToBuy;

    // const session = await mongoose.startSession();
    // session.startSession();
    for (const piece of piecesToBuy) {
      // If it's already bought
      await LandPiece.updateOne(
        { number: piece.number },
        { $set: { isBought: true } }
      );
    }
    // await session.commitTransaction()

    /**
     * Pro každý piece zjistit, jestli již náhodou nebyl koupený, poté platba, pak označit ke koupi
     */
    res.json({ message: "OK" });
  } catch (err) {
    console.log(err);
  }
};
