
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x6027a46DD32C355Ccc9316c785730a117210E92c";
const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

export default function KaotixcaDApp() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [supply, setSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  const [sendTo, setSendTo] = useState("");
  const [amount, setAmount] = useState("");

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setWallet(await signer.getAddress());
      setProvider(provider);
      setContract(contract);

      const total = await contract.totalSupply();
      setSupply(ethers.formatUnits(total, 18));

      const bal = await contract.balanceOf(await signer.getAddress());
      setBalance(ethers.formatUnits(bal, 18));
    }
  }

  async function sendKXCA() {
    if (contract && sendTo && amount) {
      const tx = await contract.transfer(sendTo, ethers.parseUnits(amount, 18));
      await tx.wait();
      alert("Sent " + amount + " KXCA");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">KaotixcaCoin (KXCA)</h1>
      {!wallet ? (
        <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <p><strong>Wallet:</strong> {wallet}</p>
          <p><strong>Total Supply:</strong> {supply} KXCA</p>
          <p><strong>Your Balance:</strong> {balance} KXCA</p>
          <div className="mt-4 space-y-2">
            <input placeholder="Recipient address" value={sendTo} onChange={e => setSendTo(e.target.value)} className="text-black px-2 py-1 w-full" />
            <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="text-black px-2 py-1 w-full" />
            <button onClick={sendKXCA} className="bg-green-600 px-4 py-2 rounded">Send KXCA</button>
          </div>
        </div>
      )}
      <div className="mt-6 space-y-1">
        <a href="https://open.spotify.com/artist/4xv3OLntL4AOKcsCacfJoZ?si=ebL40YScQPipGhaeDcldgA" target="_blank" className="text-blue-400 block">Spotify</a>
        <a href="https://music.apple.com/us/artist/jay-kaotixca/1511542847" target="_blank" className="text-pink-400 block">Apple Music</a>
        <a href="https://www.bandlab.com/jaykaotixcamuzik" target="_blank" className="text-yellow-400 block">BandLab</a>
      </div>
    </div>
  );
}
