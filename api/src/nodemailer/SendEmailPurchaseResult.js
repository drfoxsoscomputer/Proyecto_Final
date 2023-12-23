const nodemailer = require("nodemailer");
require("dotenv").config();
const { USER_NODEMAILER, PASS_NODEMAILER } = process.env;
const purchaseEmailContent = require("./purchaseEmailContent.js");

async function SendMailPurchaseResult(userEmail, result, items) {

  //console.log("Email items: " + JSON.stringify(items));

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "Gmail",
    auth: {
      user: USER_NODEMAILER,
      pass: PASS_NODEMAILER,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let subjectResult = "";
  let titleContent = "";
  let auxMessage = "";
  switch(result) {
    case "approved":
      subjectResult = "Pago Aprobado.";
      titleContent = `<h1 style="color: #02AC66">COMPRA EXITOSA</h1>`;
      auxMessage = `<h2>¡Gracias por tu compra!</h2>`;
    break;
    case "in_process":
      subjectResult = "Pago Pendiente.";
      titleContent = `<h1 style="color: #E36B2C">COMPRA PENDIENTE</h1>`;
      auxMessage = `<h2>¡Estamos validando tu compra!</h2>`;
    break;
    case "rejected":
      subjectResult = "Pago Fallido.";
      titleContent = `<h1 style="color: #EF280F">COMPRA FALLIDA</h1>`;
      auxMessage = `<h2>¡Pueden hacer tu compra de nuevo!</h2>`;
    break;
  }

  const auxContentTitle = purchaseEmailContent.replace(`<h1>*title*</h1>`, titleContent);

  let itemsAndTotalString = "";
  let auxTotal = 0;
  for (let i = 0; i < items.length; i++) {
    itemsAndTotalString += `<h1>${items[i].title} x ${items[i].quantity} und - $${items[i].unit_price * items[i].quantity} USD</h1>`;
    auxTotal += items[i].unit_price * items[i].quantity;
  }
  itemsAndTotalString += `<h1>Total: $${auxTotal} USD</h1>`;
  console.log("itemsAndTotalString: " + itemsAndTotalString);
  const auxContent = auxContentTitle.replace(`<h1>*items*</h1>`, itemsAndTotalString);
  const completeContent = auxContent.replace(`<h2>*auxMessage*</h2>`, auxMessage);
  /*<h1>Grand Theft Auto V x 2 und - $56 USD</h1>
  <h1>The Witcher 3: Wild Hunt x 1 und - $30 USD</h1>
  <h1>Total: $86 USD</h1>*/

  const mailSend = {
    from: PASS_NODEMAILER,
    //? correo de test comentar y descomentar la siguiente linea pero actualmente envía a spam
    //to: "yawon80039@jalunaki.com",
    //? descomentar para enviar al correo del usuario que se registra
    to: userEmail,
    subject: "GameWorld - " + subjectResult,
    // text: "¡Bienvenido a GameWorld " + userNickname + "!",
    html: completeContent,
  };

  transporter.sendMail(mailSend, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo enviado con éxito a ", userEmail, info.response);
    }
  });
}

module.exports = SendMailPurchaseResult;
