// app/(root)/my-wallets/page.tsx
"use client";

import React, { useState } from "react";
import sdk from "@crossmarkio/sdk";

const MyWallets = () => {
  const [signInResponse, setSignInResponse] = useState("");
  const [sessionUserResponse, setSessionUserResponse] = useState("");
  const [signTransactionTxblob, setSignTransactionTxblob] = useState("");
  const [submitTransactionResponse, setSubmitTransactionResponse] = useState("");

  const signIn = async () => {
    let address = (await sdk.async.signInAndWait()).response.data.address;
    setSignInResponse(address);
  };

  const getUserSession = async () => {
    let id = sdk.session.user?.id;
    if (id) setSessionUserResponse(id);
  };

  const signTransaction = async () => {
    let resp = await sdk.async.signAndWait({
      TransactionType: "Payment",
      Account: signInResponse,
      Destination: "rK8jihXBZCFWZqX95SET3CCi1WdRgZQwex", // Add any destination address here
      Amount: "11000000", // XRP in drops
    });
    if (resp) setSignTransactionTxblob(resp.response.data.txBlob);
  };

  const submitTransaction = async () => {
    let resp = await sdk.async.submitAndWait(signInResponse, signTransactionTxblob);
    if (resp) setSubmitTransactionResponse(resp.response.data.resp.result.hash);
  };

  return (
    <div>
      <button onClick={signIn}>Sign In</button>
      <textarea readOnly value={`Address: ${signInResponse}`}></textarea>
      <button onClick={getUserSession}>Get Session</button>
      <textarea readOnly value={`Current User ID: ${sessionUserResponse}`}></textarea>
      <button onClick={signTransaction}>Sign Transaction</button>
      <textarea readOnly value={`TxBlob: ${signTransactionTxblob}`}></textarea>
      <button onClick={submitTransaction}>Submit Transaction</button>
      <textarea readOnly value={`Hash: ${submitTransactionResponse}`}></textarea>
    </div>
  );
};

export default MyWallets;