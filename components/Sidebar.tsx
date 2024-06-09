'use client';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import PlaidLink from './PlaidLink';
import { useState } from 'react';
import sdk from "@crossmarkio/sdk";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
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
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Noriron logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Noriron</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link href={item.route} key={item.label}
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}
            >
              <div className="relative size-6">
                <Image 
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={cn({
                    'brightness-[3] invert-0': isActive
                  })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}

        <button onClick={signIn} className="sidebar-link">
          <div className="relative size-6">
            <Image 
              src="/icons/wallet.svg"
              alt="My Wallets"
              fill
            />
          </div>
          <p className="sidebar-label">My Wallets</p>
        </button>

        <PlaidLink user={user} />
      </nav>

      <div className="mt-4">
        <textarea
          className="w-full h-24 bg-gray-700 text-white p-2"
          readOnly
          value={`Address: ${signInResponse}`}
        ></textarea>
        <textarea
          className="w-full h-24 bg-gray-700 text-white p-2 mt-2"
          readOnly
          value={`Current User ID: ${sessionUserResponse}`}
        ></textarea>
        <textarea
          className="w-full h-24 bg-gray-700 text-white p-2 mt-2"
          readOnly
          value={`TxBlob: ${signTransactionTxblob}`}
        ></textarea>
        <textarea
          className="w-full h-24 bg-gray-700 text-white p-2 mt-2"
          readOnly
          value={`Hash: ${submitTransactionResponse}`}
        ></textarea>
      </div>

      <Footer user={user} />
    </section>
  );
};

export default Sidebar;