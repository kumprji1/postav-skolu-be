"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("uuid"),
    uuidv4 = _require.v4;

var mongoose = require("mongoose");

var News = require("../models/News");

var Donatable = require("../models/Donatable");

var Donation = require("../models/Donation");

var LandPiece = require("../models/LandPiece");

var Order = require("../models/Order");

var Project = require("../models/Project");

var HttpError = require("../models/HttpError");

var _require2 = require("../utils/pdf_service"),
    createBillPDF = _require2.createBillPDF;

var _require3 = require("../utils/mail_service"),
    sendEmail_OrderCreated = _require3.sendEmail_OrderCreated,
    sendEmail_OrderPurchasedAndBill = _require3.sendEmail_OrderPurchasedAndBill;

require("dotenv").config();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
    if (project) res.json(project);else return next(new HttpError("Nepodařilo se načíst projekt (nejspíše špatný url)", 500));
  })["catch"](function (err) {
    return next(new HttpError("Nepodařilo se načíst projekt", 500));
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
    return next(new HttpError("Nepodařilo se načíst aktuality", 500));
  });
};

exports.getNewsItem = function _callee2(req, res, next) {
  var newsId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          newsId = req.params.newsId;
          News.findById(newsId).populate("projectId").then(function (news) {
            res.json(news);
          })["catch"](function (err) {
            return next(new HttpError("Nepodařilo se načíst aktualitu", 500));
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
            return next(new HttpError("Nepodařilo se načíst aktualitu", 500));
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

exports.getDonations = function _callee6(req, res, next) {
  var donations;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          donations = [];
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Donation.find({
            isPurchased: true
          }).populate("donatableId"));

        case 4:
          donations = _context6.sent;
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](1);
          console.log(_context6.t0);

        case 10:
          res.json(donations);

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 7]]);
};
/**
 * Order
 */


exports.postCreateOrder = function _callee7(req, res, next) {
  var totalAmount, donationsIDs, uuid, newOrder, sessionDB_don_order, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, donation, donName, newDonation, session, contact, donations, orderId, sessionDB, order, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, donationId, don, donatable;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          totalAmount = req.body.donations.reduce(function (partSum, i) {
            return partSum + i.price;
          }, 0);
          donationsIDs = [];
          uuid = uuidv4();
          _context7.next = 5;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 5:
          sessionDB_don_order = _context7.sent;
          sessionDB_don_order.startTransaction();
          _context7.prev = 7;
          // Create Donations in DB
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context7.prev = 11;
          _iterator2 = req.body.donations[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context7.next = 28;
            break;
          }

          donation = _step2.value;
          donName = "";

          if (donation.isAnonymous) {
            donName = "Anonym";
          } else if (req.body.buyingAsCompany) {
            donName = req.body.companyInfo.title;
          } else {
            donName = req.body.contact.name + " " + req.body.contact.surname;
          }

          _context7.next = 19;
          return regeneratorRuntime.awrap(new Donation({
            price: donation.price,
            donatableId: donation.donatableId,
            createdAt: new Date(),
            isPurchased: false,
            isAnonymous: donation.isAnonymous,
            note: donation.note,
            name: donName
          }).save());

        case 19:
          newDonation = _context7.sent;

          if (newDonation) {
            _context7.next = 24;
            break;
          }

          _context7.next = 23;
          return regeneratorRuntime.awrap(sessionDB_don_order.abortTransaction());

        case 23:
          return _context7.abrupt("return", next(new HttpError("Transakce se nezdařila", 500)));

        case 24:
          donationsIDs.push(newDonation._id);

        case 25:
          _iteratorNormalCompletion2 = true;
          _context7.next = 13;
          break;

        case 28:
          _context7.next = 34;
          break;

        case 30:
          _context7.prev = 30;
          _context7.t0 = _context7["catch"](11);
          _didIteratorError2 = true;
          _iteratorError2 = _context7.t0;

        case 34:
          _context7.prev = 34;
          _context7.prev = 35;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 37:
          _context7.prev = 37;

          if (!_didIteratorError2) {
            _context7.next = 40;
            break;
          }

          throw _iteratorError2;

        case 40:
          return _context7.finish(37);

        case 41:
          return _context7.finish(34);

        case 42:
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
            isPurchased: false,
            createdAt: new Date()
          });
          _context7.next = 45;
          return regeneratorRuntime.awrap(newOrder.save());

        case 45:
          if (newOrder) {
            _context7.next = 49;
            break;
          }

          _context7.next = 48;
          return regeneratorRuntime.awrap(sessionDB_don_order.abortTransaction());

        case 48:
          return _context7.abrupt("return", next(new HttpError("Transakce se nezdařila", 500)));

        case 49:
          _context7.next = 51;
          return regeneratorRuntime.awrap(sessionDB_don_order.commitTransaction());

        case 51:
          _context7.next = 59;
          break;

        case 53:
          _context7.prev = 53;
          _context7.t1 = _context7["catch"](7);
          _context7.next = 57;
          return regeneratorRuntime.awrap(sessionDB_don_order.abortTransaction());

        case 57:
          console.log(_context7.t1);
          return _context7.abrupt("return", next(new HttpError("Nepovedlo se vytvořit objednávku", 500)));

        case 59:
          _context7.prev = 59;
          sessionDB_don_order.endSession();
          return _context7.finish(59);

        case 62:
          _context7.next = 64;
          return regeneratorRuntime.awrap(stripe.checkout.sessions.create({
            line_items: [{
              price_data: {
                currency: "czk",
                product_data: {
                  name: "Darovat"
                },
                unit_amount: totalAmount * 100,
                tax_behavior: "exclusive"
              },
              quantity: 1
            }],
            mode: "payment",
            success_url: "".concat(process.env.FRONTEND_URL, "/objednavka/").concat(newOrder._id, "?success=true&uuid=").concat(uuid),
            cancel_url: "".concat(process.env.FRONTEND_URL, "/objednavka/").concat(newOrder._id, "?canceled=true&uuid=").concat(uuid)
          }));

        case 64:
          session = _context7.sent;
          _context7.prev = 65;
          _context7.next = 68;
          return regeneratorRuntime.awrap(newOrder.update({
            stripeUrl: session.url
          }));

        case 68:
          _context7.next = 73;
          break;

        case 70:
          _context7.prev = 70;
          _context7.t2 = _context7["catch"](65);
          return _context7.abrupt("return", next(new HttpError("Nepodařilo se uložit URL stripu", 500)));

        case 73:
          // Generate Bill (generování faktury)
          contact = {
            name: req.body.buyingAsCompany ? req.body.companyInfo.title : req.body.contact.name + " " + req.body.contact.surname,
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
          }), newOrder._id.toString()); // Zde bude vytvoření a zaslání certifikátu, pokud je vyžadován !!!

          sendEmail_OrderCreated(req.body.contact.email);
          res.json({
            sessionUrl: session.url,
            message: "Order created! ",
            orderId: newOrder._id
          }); // HEROKU
          // Fulfill the purchase...
          // Pro testovací účely je obednávka a její jednotlivé dary nastavené jako zaplacené, aniž by platba byla úspěšná.

          orderId = newOrder._id;
          console.log("set this order and its donations as purchased: ", orderId);
          _context7.next = 82;
          return regeneratorRuntime.awrap(mongoose.startSession());

        case 82:
          sessionDB = _context7.sent;
          sessionDB.startTransaction();
          _context7.prev = 84;
          _context7.next = 87;
          return regeneratorRuntime.awrap(Order.findOneAndUpdate({
            _id: orderId
          }, {
            isPurchased: true,
            purchasedAt: new Date()
          }));

        case 87:
          order = _context7.sent;

          if (order) {
            _context7.next = 92;
            break;
          }

          _context7.next = 91;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 91:
          return _context7.abrupt("return", next(new HttpError("Transakce se nezdařila", 500)));

        case 92:
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context7.prev = 95;
          _iterator3 = order.donations[Symbol.iterator]();

        case 97:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context7.next = 112;
            break;
          }

          donationId = _step3.value;
          _context7.next = 101;
          return regeneratorRuntime.awrap(Donation.findByIdAndUpdate({
            _id: donationId
          }, {
            $set: {
              isPurchased: true
            }
          }));

        case 101:
          don = _context7.sent;
          _context7.next = 104;
          return regeneratorRuntime.awrap(Donatable.updateOne({
            _id: don.donatableId
          }, {
            $inc: {
              earnedMoney: don.price
            }
          }));

        case 104:
          donatable = _context7.sent;

          if (!(!don || !donatable)) {
            _context7.next = 109;
            break;
          }

          _context7.next = 108;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 108:
          return _context7.abrupt("return", next(new HttpError("Transakce se nezdařila", 500)));

        case 109:
          _iteratorNormalCompletion3 = true;
          _context7.next = 97;
          break;

        case 112:
          _context7.next = 118;
          break;

        case 114:
          _context7.prev = 114;
          _context7.t3 = _context7["catch"](95);
          _didIteratorError3 = true;
          _iteratorError3 = _context7.t3;

        case 118:
          _context7.prev = 118;
          _context7.prev = 119;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 121:
          _context7.prev = 121;

          if (!_didIteratorError3) {
            _context7.next = 124;
            break;
          }

          throw _iteratorError3;

        case 124:
          return _context7.finish(121);

        case 125:
          return _context7.finish(118);

        case 126:
          _context7.next = 128;
          return regeneratorRuntime.awrap(sessionDB.commitTransaction());

        case 128:
          _context7.next = 135;
          break;

        case 130:
          _context7.prev = 130;
          _context7.t4 = _context7["catch"](84);
          _context7.next = 134;
          return regeneratorRuntime.awrap(sessionDB.abortTransaction());

        case 134:
          console.log(_context7.t4);

        case 135:
          _context7.prev = 135;
          sessionDB.endSession();
          return _context7.finish(135);

        case 138:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[7, 53, 59, 62], [11, 30, 34, 42], [35,, 37, 41], [65, 70], [84, 130, 135, 138], [95, 114, 118, 126], [119,, 121, 125]]);
};

exports.getOrderByIdAndUUID = function _callee8(req, res, next) {
  var orderId, orderUUID, order;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          orderId = req.params.orderId;
          orderUUID = req.query.uuid;
          _context8.prev = 2;
          _context8.next = 5;
          return regeneratorRuntime.awrap(Order.findOne({
            _id: orderId,
            uuid: orderUUID
          }).populate({
            path: "donations",
            populate: {
              path: "donatableId"
            }
          }));

        case 5:
          order = _context8.sent;
          _context8.next = 11;
          break;

        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](2);
          return _context8.abrupt("return", next(new HttpError("Nepodařilo se načíst objednávku", 500)));

        case 11:
          if (order) {
            _context8.next = 13;
            break;
          }

          return _context8.abrupt("return", next(new HttpError("Nepodařilo se najít objednávku. Nejspíše nesprávna URL adresa.", 500)));

        case 13:
          // console.log(donations)
          res.json(order);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[2, 8]]);
};
/**
 * Experimental ↓↓↓
 */


exports.getFewLandPiecesO3 = function _callee9(req, res, next) {
  var landPieces;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(LandPiece.find());

        case 3:
          landPieces = _context9.sent;
          return _context9.abrupt("return", res.json(landPieces));

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.postBuyPieces = function _callee10(req, res, next) {
  var piecesToBuy, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, piece;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          piecesToBuy = req.body.landPiecesState.piecesToBuy; // const session = await mongoose.startSession();
          // session.startSession();

          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context10.prev = 5;
          _iterator4 = piecesToBuy[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context10.next = 14;
            break;
          }

          piece = _step4.value;
          _context10.next = 11;
          return regeneratorRuntime.awrap(LandPiece.updateOne({
            number: piece.number
          }, {
            $set: {
              isBought: true
            }
          }));

        case 11:
          _iteratorNormalCompletion4 = true;
          _context10.next = 7;
          break;

        case 14:
          _context10.next = 20;
          break;

        case 16:
          _context10.prev = 16;
          _context10.t0 = _context10["catch"](5);
          _didIteratorError4 = true;
          _iteratorError4 = _context10.t0;

        case 20:
          _context10.prev = 20;
          _context10.prev = 21;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 23:
          _context10.prev = 23;

          if (!_didIteratorError4) {
            _context10.next = 26;
            break;
          }

          throw _iteratorError4;

        case 26:
          return _context10.finish(23);

        case 27:
          return _context10.finish(20);

        case 28:
          // await session.commitTransaction()

          /**
           * Pro každý piece zjistit, jestli již náhodou nebyl koupený, poté platba, pak označit ke koupi
           */
          res.json({
            message: "OK"
          });
          _context10.next = 34;
          break;

        case 31:
          _context10.prev = 31;
          _context10.t1 = _context10["catch"](0);
          console.log(_context10.t1);

        case 34:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 31], [5, 16, 20, 28], [21,, 23, 27]]);
};