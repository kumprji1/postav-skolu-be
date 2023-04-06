"use strict";

//Required package
var pdf = require("pdf-creator-node");

var fs = require("fs");

var path = require("path");

exports.createBillPDF = function (data, id) {
  // Read HTML Template
  var html = fs.readFileSync(path.join(__dirname, "pdf_template.html"), "utf8"); // console.log(html)

  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Základní škola speciální a praktická škola Diakonie ČCE Vrchlabí</div>'
    },
    footer: {
      height: "28mm",
      contents: {
        first: "Zápatí",
        2: "Second page",
        // Any page number is working. 1-based index
        "default": '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
        // fallback value
        last: "Last Page"
      }
    }
  }; // let contact = {
  //   name: "Jiří Kumprecht",
  //   street_num: "Bílá Třemešná 120",
  //   city: "Bílá Třemešná",
  //   zipCode: "54472",
  //   ico: "78153186",
  //   date: "16.03.2023",
  //   totalPrice: "1200",
  // };
  // let donations = [
  //   {
  //     title: "Kup část pozemku",
  //     price: "500",
  //   },
  //   {
  //     title: "Zelená třída",
  //     price: "800",
  //   },
  // ];

  var document = {
    html: html,
    data: data,
    path: "./pdf/outputs/faktura_postavskolu_".concat(id, ".pdf"),
    type: ""
  };
  pdf.create(document, options).then(function (res) {
    console.log(res);
  })["catch"](function (error) {
    console.error(error);
  });
};