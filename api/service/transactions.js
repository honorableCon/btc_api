const { default: axios } = require("axios");

const bitcore = require("bitcore-lib");

const sendBitcoin = async (sender, receiver, amount, privateKey) => {
  try {
    const sochain_network = "BTCTEST";
    const sourceAddress = sender;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;

    const response = await axios.get(
      `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`,
      {
        headers: {
          "Accept-Encoding": "application/json",
        },
      }
    );

    const recommendedFee = await axios.get(
      "https://bitcoinfees.earn.com/api/v1/fees/recommended",
      {
        headers: {
          "Accept-Encoding": "application/json",
        },
      }
    );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    let utxos = response.data.data.txs;

    for (const element of utxos) {
      let utxo = {};
      utxo.satoshis = Math.floor(Number(element.value) * 100000000);
      utxo.script = element.script_hex;
      utxo.address = response.data.data.address;
      utxo.txId = element.txid;
      utxo.outputIndex = element.output_no;
      totalAmountAvailable += utxo.satoshis;
      inputCount += 1;
      inputs.push(utxo);
    }

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;
    fee = (transactionSize * recommendedFee.data.hourFee) / 3;
    if (totalAmountAvailable - amount - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }

    transaction.from(inputs);
    transaction.to(receiver, amount);
    transaction.change(sourceAddress);
    transaction.fee(Math.round(fee));
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();

    const result = await axios({
      method: "POST",
      url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
      headers: {
        "Accept-Encoding": "application/json",
      },
      data: {
        tx_hex: serializedTransaction,
      },
    });
    return result.data.data;
  } catch (error) {
    return error;
  }
};
module.exports = { sendBitcoin };
