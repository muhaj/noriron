const express = require('express');
const { connectToXRP, createTransaction, createToken } = require('../xrpClient');
const app = express();
const port = 3001;

app.use(express.json());

app.get('/connect', async (req, res) => {
  const client = await connectToXRP();
  res.send('Connected to XRP Ledger');
});

app.post('/transaction', async (req, res) => {
  const { wallet, destination, amount } = req.body;
  const client = await connectToXRP();
  await createTransaction(client, wallet, destination, amount);
  res.send('Transaction completed');
});

app.post('/token', async (req, res) => {
  const { wallet, tokenName, amount } = req.body;
  const client = await connectToXRP();
  await createToken(client, wallet, tokenName, amount);
  res.send('Token created');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});