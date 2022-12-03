const express = require("express");
const app = express();
const { sendBitcoin } = require("./service/transactions");
const { createWallet } = require("./service/wallet");
const bodyParser = require("body-parser");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/wallet", (req, res) => {
  const { network } = req.body;
  const wallet = createWallet(network);
  res.json(wallet);
});

app.post("/transactions", async (req, res) => {
  const { sender, receiver, privateKey, amount } = req.body;
  const txn = await sendBitcoin(sender, receiver, amount, privateKey);
  res.json(txn);
});

app.get("/", (req, res) => {
  res.send("Welcome to SunuWallet !");
});

app.post("/ussd", (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";

  if (text == "") {
    response = `CON What would you like to check
        1. My account
        2. My phone number`;
  } else if (text == "1") {
    response = `CON Choose account information you want to view
        1. Account number`;
  } else if (text == "2") {
    response = `END Your phone number is ${phoneNumber}`;
  } else if (text == "1*1") {
    const accountNumber = "ACC100101";
    response = `END Your account number is ${accountNumber}`;
  }
  res.set("Content-Type: text/plain");
  res.send(response);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
