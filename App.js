import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const tokenAddress = "0x6027a46DD32C355Ccc9316c785730a117210E92c"; // KXCA token address
const tokenABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState(0);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      const token = new ethers.Contract(tokenAddress, tokenABI, provider);
      const bal = await token.balanceOf(address);
      const sym = await token.symbol();
      const total = await token.totalSupply();
      setBalance(ethers.formatUnits(bal, 18));
      setSymbol(sym);
      setSupply(ethers.formatUnits(total, 18));
    }
  }

  return (
    <div className="container">
      <h1>KaotixcaCoin (KXCA)</h1>
      <p>Smart Contract: {tokenAddress}</p>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && (
        <div>
          <p>Wallet: {account}</p>
          <p>Balance: {balance} {symbol}</p>
          <p>Total Supply: {supply} {symbol}</p>
        </div>
      )}
      <div className="links">
        <a href="https://www.bandlab.com/jaykaotixcamuzik" target="_blank">BandLab</a> | 
        <a href="https://music.apple.com/us/artist/jay-kaotixca/1511542847" target="_blank">Apple Music</a> | 
        <a href="https://open.spotify.com/artist/4xv3OLntL4AOKcsCacfJoZ" target="_blank">Spotify</a>
      </div>
    </div>
  );
}

export default App;