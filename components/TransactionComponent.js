import React, { useState } from 'react';
import axios from 'axios';

const TransactionComponent = () => {
  const [transaction, setTransaction] = useState(null);

  const handleTransaction = async () => {
    const response = await axios.post('http://localhost:3001/transaction', {
      wallet: { address: 'your_wallet_address', secret: 'your_wallet_secret' },
      destination: 'destination_address',
      amount: '10'
    });
    setTransaction(response.data);
  };

  return (
    <div>
      <h1>Transaction Data</h1>
      <button onClick={handleTransaction}>Send Transaction</button>
      {transaction && <pre>{JSON.stringify(transaction, null, 2)}</pre>}
    </div>
  );
};

export default TransactionComponent;