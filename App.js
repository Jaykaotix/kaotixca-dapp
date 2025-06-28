import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x6027a46DD32C355Ccc9316c785730a117210E92c";
const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

function App() {
  const [wallet, setWallet] = useState(null);
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
      const c = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setWallet(await signer.getAddress());
      setContract(c);

      const total = await c.totalSupply();
      setSupply(ethers.formatUnits(total, 18));

      const bal = await c.balanceOf(await signer.getAddress());
      setBalance(ethers.formatUnits(bal, 18));
    }
  }

  async function sendKXCA() {
    if (contract && sendTo && amount) {
      const tx = await contract.transfer(sendTo, ethers.parseUnits(amount, 18));
      await tx.wait();
      alert(`Sent ${amount} KXCA`);
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>KaotixcaCoin (KXCA)</h1>
      {!wallet ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p><strong>Wallet:</strong> {wallet}</p>
          <p><strong>Total Supply:</strong> {supply} KXCA</p>
          <p><strong>Your Balance:</strong> {balance} KXCA</p>

          <input placeholder="To Address" value={sendTo} onChange={e => setSendTo(e.target.value)} style={{ color: '#000' }} /><br />
          <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ color: '#000' }} /><br />
          <button onClick={sendKXCA}>Send KXCA</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <a href="https://open.spotify.com/artist/4xv3OLntL4AOKcsCacfJoZ?si=ebL40YScQPipGhaeDcldgA" style={{ color: '#1DB954' }}>Spotify</a><br />
        <a href="https://music.apple.com/us/artist/jay-kaotixca/1511542847" style={{ color: '#fa5b5b' }}>Apple Music</a><br />
        <a href="https://www.bandlab.com/jaykaotixcamuzik" style={{ color: '#facc15' }}>BandLab</a>
      </div>
    </div>
  );
}

export default App;