"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('uuid'),
    uuidv4 = _require.v4;

var mongoose = require("mongoose");

var News = require('../models/News');

var Donatable = require("../models/Donatable");

var Donation = require("../models/Donation");

var LandPiece = require("../models/LandPiece");

var Order = require("../models/Order");

var Project = require("../models/Project");

var HttpError = require('../models/HttpError');

var _require2 = require('../utils/pdf_service'),
    createBillPDF = _require2.createBillPDF;

var _require3 = require('../utils/mail_service'),
    sendEmail_OrderCreated = _require3.sendEmail_OrderCreated;

require('dotenv').config();

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
/**
 * Project
 */


exports.getProject = function _callee(req, res, next) {
  var projectId;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          projectId = req.params.projectId;
          Project.findOne({
            _id: projectId
          }).then(function (project) {
            res.json(project);
          })["catch"](function (err) {
            return console.log(err);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.getProjects = function (req, res, next) {
  Project.find({
    deleted: false
  }).then(function (projects) {
    res.json(projects);
  })["catch"](function (err) {
    return console.log(err);
  });
};

exports.getProjectByTitle = function (req, res, next) {
  var urlTitle = req.params.urlTitle;
  Project.findOne({
    urlTitle: urlTitle
  }).then(function (project) {
    if (project) res.json(project);else return next(new HttpError('Nepodařilo se načíst projekt (nejspíše špatný url)', 500));
  })["catch"](function (err) {
    return next(new HttpError('Nepodařilo se načíst projekt', 500));
  });
};
/**
 * News
 */


exports.getNewsByProjectId = function (req, res, next) {
  var projectId = req.params.projectId;
  News.find({
    projectId: projectId,
    deleted: false
  }).then(function (news) {
    if (news) res.json(news);else res.json([]);
  })["catch"](function (err) {
    return next(new HttpError('Nepodařilo se načíst aktuality', 500));
  });
};

exports.getNewsItem = function _callee2(req, res, next) {
  var newsId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          newsId = req.params.newsId;
          News.findById(newsId).populate('projectId').then(function (news) {
            res.json(news);
          })["catch"](function (err) {
            return next(new HttpError('Nepodařilo se načíst aktualitu', 500));
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};
/**
 * Donatable
 */


exports.getDonatablesByProjectId = function _callee3(req, res, next) {
  var projectId, donatables, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, donatable;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          projectId = req.params.projectId;
          donatables = [];
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Donatable.find({
            projectId: projectId,
            deleted: false
          }));

        case 5:
          donatables = _context3.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 9;

          for (_iterator = donatables[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            donatable = _step.value;
          }

          _context3.next = 17;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 17:
          _context3.prev = 17;
          _context3.prev = 18;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 20:
          _context3.prev = 20;

          if (!_didIteratorError) {
            _context3.next = 23;
            break;
          }

          throw _iteratorError;

        case 23:
          return _context3.finish(20);

        case 24:
          return _context3.finish(17);

        case 25:
          _context3.next = 30;
          break;

        case 27:
          _context3.prev = 27;
          _context3.t1 = _context3["catch"](2);
          console.log(_context3.t1);

        case 30:
          res.json(donatables);

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 27], [9, 13, 17, 25], [18,, 20, 24]]);
};

exports.getDonatableById = function _callee4(req, res, next) {
  var donatableId;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          donatableId = req.params.donatableId;
          Donatable.findById(donatableId).then(function (donatable) {
            res.json(donatable);
          })["catch"](function (err) {
            return next(new HttpError('Nepodařilo se načíst aktualitu', 500));
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};
/**
 * Donations
 */


exports.getDonationsByDonatableId = function _callee5(req, res, next) {
  var donations;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          donations = [];
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Donation.find({
            donatableId: req.params.donatableId,
            isPurchased: true
          }));

        case 4:
          donations = _context5.sent;
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          console.log(_context5.t0);

        case 10:
          res.json(donations);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 7]]);
};
/**
 * Order
 */


exports.postCreateOrder = function _callee6(req, res, next) {
  var totalAmount, donationsIDs, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, donation, donName, newDonation, uuid, newOrder, session, contact, donations;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          totalAmount = req.body.donations.reduce(function (partSum, i) {
            return partSum + i.price;
          }, 0); // const orderData
          // console.log(pieces);

          donationsIDs = []; // Create Donations in DB

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context6.prev = 5;
          _iterator2 = req.body.donations[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context6.next = 18;
            break;
          }

          donation = _step2.value;
          donName = '';

          if (donation.isAnonymous) {
            donName = 'Anonym';
          } else if (req.body.buyingAsCompany) {
            donName = req.body.companyInfo.title;
          } else {
            donName = req.body.contact.name + ' ' + req.body.contact.surname;
          }

          _context6.next = 13;
          return regeneratorRuntime.awrap(new Donation({
            price: donation.price,
            donatableId: donation.donatableId,
            createdAt: new Date(),
            isPurchased: true,
            isAnonymous: donation.isAnonymous,
            note: donation.note,
            name: donName
          }).save());

        case 13:
          newDonation = _context6.sent;
          donationsIDs.push(newDonation._id);

        case 15:
          _iteratorNormalCompletion2 = true;
          _context6.next = 7;
          break;

        case 18:
          _context6.next = 24;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context6.t0;

        case 24:
          _context6.prev = 24;
          _context6.prev = 25;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 27:
          _context6.prev = 27;

          if (!_didIteratorError2) {
            _context6.next = 30;
            break;
          }

          throw _iteratorError2;

        case 30:
          return _context6.finish(27);

        case 31:
          return _context6.finish(24);

        case 32:
          uuid = uuidv4();
          console.log(req.body.companyInfo);
          newOrder = new Order({
            contact: {
              name: req.body.contact.name,
              surname: req.body.contact.surname,
              email: req.body.contact.email,
              mobile: req.body.contact.mobile
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
            isPurchased: true,
            createdAt: new Date()
          });
          _context6.next = 37;
          return regeneratorRuntime.awrap(newOrder.save());

        case 37:
          _context6.next = 39;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            line_items: [{
              price_data: {
                currency: 'czk',
                product_data: {
                  name: 'Darovat'
                },
                unit_amount: totalAmount * 100,
                tax_behavior: 'exclusive'
              },
              quantity: 1
            }],
            mode: 'payment',
            success_url: "".concat(process.env.FRONTEND_URL, "/objednavka/").concat(newOrder._id, "?success=true&uuid=").concat(uuid),
            cancel_url: "".concat(process.env.FRONTEND_URL, "/objednavka/").concat(newOrder._id, "?canceled=true&uuid=").concat(uuid)
          }));

        case 39:
          session = _context6.sent;
          _context6.prev = 40;
          _context6.next = 43;
          return regeneratorRuntime.awrap(newOrder.update({
            stripeUrl: session.url
          }));

        case 43:
          _context6.next = 48;
          break;

        case 45:
          _context6.prev = 45;
          _context6.t1 = _context6["catch"](40);
          return _context6.abrupt("return", next(new HttpError('Nepodařilo se uložit URL stripu', 500)));

        case 48:
          // Generate Bill (generování faktury)
          contact = {
            name: req.body.buyingAsCompany ? req.body.companyInfo.title : req.body.contact.name + ' ' + req.body.contact.surname,
            street_num: req.body.certificateInfo.street_num,
            city: req.body.certificateInfo.city,
            zipCode: req.body.certificateInfo.zipCode.toString(),
            ico: req.body.companyInfo.ico.toString(),
            date: "16.03.2023",
            totalPrice: totalAmount.toString()
          };
          donations = req.body.donations.map(function (don) {
            return {
              title: don.title,
              price: don.price.toString()
            };
          });
          createBillPDF(_objectSpread({}, contact, {
            donations: donations
          }), newOrder._id.toString());
          sendEmail_OrderCreated(req.body.contact.email);
          res.json({
            sessionUrl: session.url,
            message: 'Order created! ',
            orderId: newOrder._id
          }); // res.json({message: 'Order created! ', orderId: newOrder._id})
          // lets PAYYY

        case 53:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 20, 24, 32], [25,, 27, 31], [40, 45]]);
};

exports.getOrderByIdAndUUID = function _callee7(req, res, next) {
  var orderId, orderUUID, order;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          orderId = req.params.orderId;
          orderUUID = req.query.uuid;
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            uuid: orderUUID
          }).populate({
            path: 'donations',
            populate: {
              path: 'donatableId'
            }
          }));

        case 5:
          order = _context7.sent;
          _context7.next = 11;
          break;

        case 8:
          _context7.prev = 8;
          _context7.t0 = _context7["catch"](2);
          return _context7.abrupt("return", next(new HttpError('Nepodařilo se načíst objednávku', 500)));

        case 11:
          if (order) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", next(new HttpError('Nepodařilo se najít objednávku. Nejspíše nesprávna URL adresa.', 500)));

        case 13:
          // console.log(donations)
          res.json(order);

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 8]]);
};
/**
 * Experimental ↓↓↓
 */


exports.getFewLandPiecesO3 = function _callee8(req, res, next) {
  var landPieces;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(LandPiece.find());

        case 3:
          landPieces = _context8.sent;
          return _context8.abrupt("return", res.json(landPieces));

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);

        case 10:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.postBuyPieces = function _callee9(req, res, next) {
  var piecesToBuy, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, piece;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          piecesToBuy = req.body.landPiecesState.piecesToBuy; // const session = await mongoose.startSession();
          // session.startSession();

          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context9.prev = 5;
          _iterator3 = piecesToBuy[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context9.next = 14;
            break;
          }

          piece = _step3.value;
          _context9.next = 11;
          return regeneratorRuntime.awrap(LandPiece.updateOne({
            number: piece.number
          }, {
            $set: {
              isBought: true
            }
          }));

        case 11:
          _iteratorNormalCompletion3 = true;
          _context9.next = 7;
          break;

        case 14:
          _context9.next = 20;
          break;

        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](5);
          _didIteratorError3 = true;
          _iteratorError3 = _context9.t0;

        case 20:
          _context9.prev = 20;
          _context9.prev = 21;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 23:
          _context9.prev = 23;

          if (!_didIteratorError3) {
            _context9.next = 26;
            break;
          }

          throw _iteratorError3;

        case 26:
          return _context9.finish(23);

        case 27:
          return _context9.finish(20);

        case 28:
          // await session.commitTransaction()

          /**
           * Pro každý piece zjistit, jestli již náhodou nebyl koupený, poté platba, pak označit ke koupi
           */
          res.json({
            message: "OK"
          });
          _context9.next = 34;
          break;

        case 31:
          _context9.prev = 31;
          _context9.t1 = _context9["catch"](0);
          console.log(_context9.t1);

        case 34:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 31], [5, 16, 20, 28], [21,, 23, 27]]);
};