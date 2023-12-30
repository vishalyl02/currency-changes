import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import the external CSS file

const App = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {

    axios.get('http://localhost:3001/api/cryptocurrencies')
      .then(response => setCryptocurrencies(response.data))
      .catch(error => console.error('Error fetching cryptocurrencies:', error));
  }, []);

  const handleConvert = () => {
    if (!sourceCurrency || !amount) {
      alert('Please select a source currency and enter an amount.');
      return;
    }
  
    axios.post('http://localhost:3001/api/convert', { sourceCurrency, amount, targetCurrency })
      .then(response => {
        const convertedAmountFromResponse = response.data.convertedAmount;
        console.log('Conversion response:', convertedAmountFromResponse);
  

        setConvertedAmount(convertedAmountFromResponse);
  

        console.log('Converted Amount State:', convertedAmountFromResponse);
      })
      .catch(error => console.error('Error converting currency:', error));
  };
  

  return (
    <div className="App">
      <h1>Crypto Currency Converter</h1>
      <form>
        <label>
          Source Currency:
          <select onChange={(e) => setSourceCurrency(e.target.value)}>
            <option value="">Select a currency</option>
            {cryptocurrencies.map(crypto => (
              <option key={crypto.id} value={crypto.id}>{crypto.symbol}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <label>
          Target Currency:
          <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          
          </select>
        </label>
        <br />
        <button type="button" onClick={handleConvert}>Convert</button>
      </form>
   
      {convertedAmount !== null && (
        <div>
          <h2>Converted Amount:</h2>
          <p>{convertedAmount} {targetCurrency.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
};

export default App;
