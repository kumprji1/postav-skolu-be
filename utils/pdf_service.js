//Required package
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");



exports.createBillPDF = (data, id) => {
  // Read HTML Template
  const html = fs.readFileSync(
    path.join(__dirname, "pdf_template.html"),
    "utf8"
  );

  let options = {
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    },
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents:
        '<div style="text-align: center;">Základní škola speciální a praktická škola Diakonie ČCE Vrchlabí</div>',
    },
    footer: {
      height: "28mm",
      contents: {
        first: "Zápatí",
        2: "Second page", // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: "Last Page",
      },
    },
  };

  // let contact = {
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

  let document = {
    html: html,
    data: data,
    path: path.join(__dirname, `../pdf/outputs/faktura_postavskolu_${id}.pdf`),
    type: "",
  };

  pdf
    .create(document, options)
    .then((res) => {
      console.log('Generování souboru faktury proběhlo v pořádku')
      console.log(res);
    })
    .catch((error) => {
      console.log('Chyba při generování souboru faktury')
      console.error(error);
    });
};
