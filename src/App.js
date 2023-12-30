import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const backgroundStyle = {
  backgroundImage: `url('https://images.pexels.com/photos/7130487/pexels-photo-7130487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
  backgroundSize: 'cover',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: -1,
};

const resultStyle = {
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
  borderRadius: theme.spacing(1),
};

const App = () => {
  const [top100Cryptos, setTop100Cryptos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sourceCurrency: 'BTC',
    amount: 1,
    targetCurrency: 'USD',
  });
  const [val,SetVal]=useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [resultSourceCurrency, setResultSourceCurrency] = useState('');
  const [resultAmount, setResultAmount] = useState(null);

  useEffect(() => {
    // Fetch top 100 cryptocurrencies
    fetch('https://backend-deploy-88ng.onrender.com/api/top100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(response => response.json())
      .then(data => {
        setTop100Cryptos(data);
      })
      .catch(error => console.error('Error fetching top 100 cryptocurrencies:', error));
  }, []);

  const handleConversion = () => {
    setLoading(true);
    fetch('https://backend-deploy-88ng.onrender.com/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        const conversionRate = data.quote.USD.price;
        if (!isNaN(conversionRate)) {
          const convertedAmount = formData.amount * conversionRate;
          setConversionResult({
            ...data,
            convertedAmount,
          });
          setResultSourceCurrency(formData.sourceCurrency);
          SetVal(formData.amount)
          setResultAmount(convertedAmount);
        } else {
          console.error('Invalid data type for conversion rate:', conversionRate);
        }
      })
      .catch(error => console.error('Error performing currency conversion:', error))
      .finally(() => setLoading(false));
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={backgroundStyle}>
        <Container maxWidth="md" style={{ marginTop: theme.spacing(4) }}>
          <Typography variant="h3" align="center" gutterBottom>
            Crypto Converter
          </Typography>

          <div>
            <Typography variant="h5" gutterBottom>
              Top 100 Cryptocurrencies
            </Typography>
            <Select
              name="sourceCurrency"
              value={formData.sourceCurrency}
              onChange={handleInputChange}
              fullWidth
            >
              {top100Cryptos.map(crypto => (
                <MenuItem key={crypto.id} value={crypto.symbol}>
                  {crypto.name} - {crypto.symbol}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: theme.spacing(4) }}>
            <Typography variant="h5" gutterBottom>
              Currency Conversion
            </Typography>
            <TextField
              type="number"
              name="amount"
              label="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Select
              name="targetCurrency"
              value={formData.targetCurrency}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            >
              <MenuItem value="USD">USD</MenuItem>
              {/* Add more target currencies as needed */}
            </Select>
            <Button variant="contained" color="primary" onClick={handleConversion}>
              Convert
            </Button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: theme.spacing(4) }}>
              <CircularProgress />
            </div>
          )}

          {conversionResult && (
            <Paper style={resultStyle}>
              <Typography variant="h6">Conversion Result:</Typography>
              <Typography>
                {val} {resultSourceCurrency} is equal to{' '}
                {resultAmount} {formData.targetCurrency}
              </Typography>
            </Paper>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;
