const { v4: uuidv4 } = require('uuid');

const mongoose = require("mongoose");

const News = require('../models/News');
const Donatable = require("../models/Donatable");
const Donation = require("../models/Donation");
const LandPiece = require("../models/LandPiece");
const Order = require("../models/Order");
const Project = require("../models/Project");
const HttpError = require('../models/HttpError');

const { createBillPDF } = require('../utils/pdf_service');
const { sendEmail_OrderCreated } = require('../utils/mail_service');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/**
 * Project
 */
exports.getProject = async (req, res, next) => {
  const { projectId } = req.params;
  Project.findOne({_id: projectId})
    .then((project) => {
      res.json(project);
    })
    .catch((err) => console.log(err));

}

exports.getProjects = (req, res, next) => {
  Project.find({deleted: false})
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
 * News
 */
exports.getNewsByProjectId = (req, res, next) => {
  const { projectId } = req.params;
  News.find({ projectId: projectId, deleted: false })
    .then((news) => {
      if (news) 
        res.json(news);
      else
        res.json([])
    })
    .catch((err) => {
      return next(new HttpError('Nepodařilo se načíst aktuality', 500))
    });
}

exports.getNewsItem = async (req, res, next) => {
  const { newsId } = req.params;
  News.findById(newsId).populate('projectId')
    .then((news) => {
      res.json(news);
    })
    .catch((err) => 
     next(new HttpError('Nepodařilo se načíst aktualitu', 500)));

}


/**
 * Donatable
 */
exports.getDonatablesByProjectId = async (req, res, next) => {
  const projectId = req.params.projectId
  let donatables = []
  try {
    donatables = await Donatable.find({ projectId: projectId, deleted: false})
    for (const donatable of donatables) {
      
    }
  } catch (err) {
    console.log(err);
  }
  res.json(donatables)
}
exports.getDonatableById = async (req, res, next) => {
  const { donatableId } = req.params;
  Donatable.findById(donatableId)
    .then((donatable) => {
      res.json(donatable);
    })
    .catch((err) => 
     next(new HttpError('Nepodařilo se načíst aktualitu', 500)));

}

/**
 * Donations
 */
exports.getDonationsByDonatableId = async (req, res, next) => {
  let donations = []
  try {
    donations = await Donation.find({ donatableId: req.params.donatableId, isPurchased: true })
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
    req.body.donations.reduce((partSum, i) => partSum + i.price, 0)

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
      isPurchased: false,
      isAnonymous: donation.isAnonymous,
      note: donation.note,
      name: donName
    }).save();
    donationsIDs.push(newDonation._id);
  }

  const uuid = uuidv4();

  console.log(req.body.companyInfo)
  const newOrder = new Order({
    contact: {
      name: req.body.contact.name,
      surname: req.body.contact.surname,
      email: req.body.contact.email,
      mobile: req.body.contact.mobile,
    },
    buyingAsCompany: req.body.buyingAsCompany,
    wantsCertificate: req.body.wantsCertificate,
    companyInfo: {
      title: req.body.companyInfo.title,
      ico: req.body.companyInfo.ico,
      dic: req.body.companyInfo.dic  
    },
    certificateInfo: {
      street_num: req.body.certificateInfo.street_num,
      city: req.body.certificateInfo.city,
      zipCode: req.body.certificateInfo.zipCode
    },
    paymentMethod: req.body.paymentMethod,
    deliveryMethod: req.body.deliveryMethod,
    products: [],
    donations: donationsIDs,
    totalAmount: totalAmount,
    uuid: uuid,
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
    success_url: `${process.env.FRONTEND_URL}/objednavka/${newOrder._id}?success=true&uuid=${uuid}`,
    cancel_url: `${process.env.FRONTEND_URL}/objednavka/${newOrder._id}?canceled=true&uuid=${uuid}`,
  });

  
try {
  await newOrder.update({ stripeUrl: session.url })
} catch (error) {
  return next(new HttpError('Nepodařilo se uložit URL stripu', 500))
}

// Generate Bill (generování faktury)
let contact = {
  name: req.body.buyingAsCompany ? req.body.companyInfo.title : req.body.contact.name + ' ' + req.body.contact.surname,
  street_num: req.body.certificateInfo.street_num,
  city: req.body.certificateInfo.city,
  zipCode: req.body.certificateInfo.zipCode.toString(),
  ico: req.body.companyInfo.ico.toString(),
  date: "16.03.2023",
  totalPrice: totalAmount.toString(),
};

let donations = req.body.donations.map(don => ({
  title: don.title,
  price: don.price.toString()
}));

createBillPDF({...contact, donations}, newOrder._id.toString())
sendEmail_OrderCreated(req.body.contact.email)

  res.json({ sessionUrl: session.url, message: 'Order created! ', orderId: newOrder._id })

  
  // res.json({message: 'Order created! ', orderId: newOrder._id})
  // lets PAYYY

};

exports.getOrderByIdAndUUID = async (req, res, next) => {
  const orderId = req.params.orderId
  const orderUUID = req.query.uuid

  let order;
  // let donations = []

  try {
    order = await Order.findOne({_id: orderId, uuid: orderUUID}).populate({
      path: 'donations',
      populate: {
        path: 'donatableId'
      }
    })
    // for (const donation of order.donations) {
    //   const don = await Donation.findOne({_id: donation}).populate('donatableId', 'title photo').lean()
    //   donations.push(don)
    // }
  } catch (err) {
    return next(new HttpError('Nepodařilo se načíst objednávku', 500))
  }

  // If no order found
  if (!order)
  return next(new HttpError('Nepodařilo se najít objednávku. Nejspíše nesprávna URL adresa.', 500))

  // console.log(donations)
  res.json(order)
}

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
