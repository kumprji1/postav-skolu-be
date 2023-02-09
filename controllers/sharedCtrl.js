const mongoose = require("mongoose");
const Donation = require("../models/Donation");

const LandPiece = require("../models/LandPiece");
const Order = require("../models/Order");
const Project = require("../models/Project");

exports.getProjectByCategory = (req, res, next) => {
  const { category } = req.params;
  Project.find({ category: category })
    .then((projects) => {
      res.json(projects);
    })
    .catch((err) => console.log(err));
};

exports.getProject = (req, res, next) => {
  const { urlTitle } = req.params;
  Project.findOne({ urlTitle: urlTitle })
    .then((project) => {
      res.json(project);
    })
    .catch((err) => console.log(err));
};

exports.postCreateOrder = async (req, res, next) => {
  const totalAmount =
    req.body.donations.reduce((partSum, i) => partSum + i.price, 0) +
    req.body.products.reduce((partSum, i) => partSum + i.price, 0) +
    req.body.pieces.reduce((partSum, i) => partSum + i.price, 0);
    console.log(totalAmount)
  // console.log(req.body)
  // const orderData
  res.json({ message: "ok" });
  // console.log(pieces);
  const piecesIDs = req.body.pieces.map((p) => p.id);
  const donationsIDs = [];

  // Create Donations in DB
  for (const donation of req.body.donations) {
    const newDonation = await new Donation({
      price: donation.price,
      projectId: donation.projectId,
      createdAt: new Date(),
      isPurchased: false,
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
    pieces: piecesIDs,
    totalAmount: totalAmount,
    isPurchased: false,
    createdAt: new Date(),
  });
  await newOrder.save();

  
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
