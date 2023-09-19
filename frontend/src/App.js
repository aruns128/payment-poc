import React, { useState } from 'react'
import './App.css';
import axios from 'axios'


function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}




function App() {
  const [amount, setAmount] = useState('')

  async function displayRazorpay() {
    // Assuming 'loadScript' is defined correctly in your code
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/razorpay`, {
        amount: amount
      });

      const data = response.data;
      console.log(data);

      const options = {
        key: process.env.REACT_APP_KEY_ID,
        currency: data.currency,
        amount: data.amount.toString(),
        order_id: data.id,
        name: 'Donation',
        description: 'Thank you for nothing. Please give us some money',
        image: `${process.env.REACT_APP_BACKEND}/logo.svg`,
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        prefill: {
          name: "Arunkumar",
          email: 'thisistestmailid@gmail.com',
          phone_number: '9876543210',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          Simple payment App with Razorpay
        </p>
        {/* <input onChange={(e) => setAmount(e.target.value)} value={amount} />
        <button
          onClick={displayRazorpay}
          target="_blank"
          rel="noopener noreferrer"
        >
          {`Donate`}
        </button> */}
        <div className="payment-card">
          <input
            type="text" // Change the input type to "text"
            inputMode="numeric" // Specify numeric input mode
            pattern="[0-9]*" // Restrict input to numbers only
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* <input
            type="number"
            placeholder="Enter donation amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          /> */}
          <button className="donate-button" onClick={displayRazorpay}>Donate</button>
        </div>
      </header>
    </div>
  )
}

export default App
