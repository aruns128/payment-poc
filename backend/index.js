const express = require('express');
const path = require('path');
const shortid = require('shortid');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

require('dotenv').config()

const app = express();
const port = 1337;

app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
	key_id: process.env.key_id,
	key_secret: process.env.key_secret,
});

// Serve the logo
app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg'));
});

// Payment verification endpoint
app.post('/verification', (req, res) => {
	// Replace '12345678' with your actual validation secret
	const secret = '12345678';

	console.log(req.body);

	const shasum = crypto.createHmac('sha256', secret);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest('hex');

	console.log(digest, req.headers['x-razorpay-signature']);

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('Request is legit');
		// Process the payment
		fs.writeFileSync('payment1.json', JSON.stringify(req.body, null, 4));
	} else {
		// Reject the request or handle it as needed
		console.log('Invalid request');
	}
	res.json({ status: 'ok' });
});

// Create a Razorpay order
app.post('/razorpay', async (req, res) => {
	console.log(req.body);
	const payment_capture = 1;
	const amount = req.body.amount;
	const currency = 'INR';

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture,
	};

	try {
		const response = await razorpay.orders.create(options);
		console.log(response);
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'An error occurred' });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
