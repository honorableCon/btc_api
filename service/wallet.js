const { PrivateKey } = require("bitcore-lib");
const Mnemonic = require("bitcore-mnemonic/lib/mnemonic");

const createWallet = (network) => {
  const privateKey = new PrivateKey();
  const address = privateKey.toAddress(network);

  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};

const createHDWallet = (network) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.FRENCH);
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };
};

module.exports = { createHDWallet, createWallet };
