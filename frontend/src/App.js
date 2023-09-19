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
      const response = await axios.post('http://localhost:1337/razorpay', {
        amount: amount
      });

      const data = response.data;
      console.log(data);

      const options = {
        key: 'rzp_test_5iSAt39JajsMey',
        currency: data.currency,
        amount: data.amount.toString(),
        order_id: data.id,
        name: 'Donation',
        description: 'Thank you for nothing. Please give us some money',
        image: 'http://localhost:1337/logo.svg',
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        prefill: {
          name: "Arunkumar",
          email: 'thisistestmailid@gmail.com',
          phone_number: '9899999999',
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
        <input onChange={(e) => setAmount(e.target.value)} value={amount} />
        <button
          className="App-link"
          onClick={displayRazorpay}
          target="_blank"
          rel="noopener noreferrer"
        >
          {`Donate INR ${amount}`}
        </button>
      </header>
    </div>
  )
}

export default App
