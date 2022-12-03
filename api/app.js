const express = require("express");
const app = express();
const { sendBitcoin } = require("./service/transactions");
const { createWallet } = require("./service/wallet");

const port = process.env.PORT || 5000;

app.use(express.json());

app.post("/wallet", (req, res) => {
  const wallet = createWallet();
  res.json(wallet);
});

app.post("/transactions", async (req, res) => {
  const { sender, receiver, privateKey, amount } = req.body;
  const txn = await sendBitcoin(sender, receiver, amount, privateKey);
  res.json(txn);
});

app.get("/", (req, res) => {
  res.send("Welcome to SunuWallet!");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
