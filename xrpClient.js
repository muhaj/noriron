const xrpl = require('xrpl');

async function connectToXRP() {
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  console.log('Connected to XRP Ledger');
  return client;
}

async function createTransaction(client, wallet, destination, amount) {
  const prepared = await client.autofill({
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(amount),
    Destination: destination
  });
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  console.log('Transaction result:', result);
}

async function createToken(client, wallet, tokenName, amount) {
  const prepared = await client.autofill({
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(amount),
    Destination: wallet.address,
    Memos: [{ Memo: { MemoData: xrpl.convertStringToHex(tokenName) } }]
  });
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  console.log('Token created:', result);
}

module.exports = { connectToXRP, createTransaction, createToken };