const express = require('express');
const cors = require('cors');
const mongoose= require('mongoose');
const session = require('express-session');
const cookiesParser = require('cookie-parser');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
dotenv.config();

const apirouter=require('./routes/ApiRoutes');
// Middleware

app.use(cors(
  {origin:true}
)); 
app.use(express.json());
app.use(cookiesParser());

mongoose
  .connect(
    "mongodb://localhost:27017/mentorship",
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
 

// Test route
app.use("/api", apirouter);

const stripe = require("stripe")("sk_test_51PIELWG3sFUL55M0SmGDdHEVjqYXVHN7zpu7tnQ766fSdtdB5PrEzSDH2g6CF7k4RlyjjGdrU1TxL4g3Lq1BKO1F00EOHKVNZ7");

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map(item => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.mentor_photo], // Adding mentor photo
            },
            unit_amount: item.price_data * 100, // Convert to cents
          },
          quantity: item.quantity,
        };
      }),
      success_url: 'http://localhost:3000/pages/success',
      cancel_url: 'http://127.0.0.1:5173/cancel'
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true })); // Replaces bodyParser.urlencoded()


const accessToken = 'EAAGseI05YLYBOybosPlQPOcOAPYdHlJGKq6lSoUFisTlssOEs6qK8ZAjnxieKZAparfD8MI51XZATsZBl3crFkr5Q4S6OOFr3BTZBGTZCICBQqEROrk9g0pZBjpPEZCIRV8GSZCZAatPaPtEvw8ZCYOfAjlGYOoV0aPDWvQpQPyTJYg3gKA5QY2K4ay61TFIvk8QjYxDJEq1nhdAbbjO6RLdPp7v4AM8QbrugnsyXAZD';

app.use(express.json());

app.post('/send-message', (req, res) => {
  const phone = req.body.phoneNumber; 
  const to = `212${phone.substring(1)}`; 
  console.log('the phone number from req.body is ',to)// Replace with the recipient's phone number
  const templateName = 'temp_appointments'; // Update with your actual template name
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en_US' // English (US) language code
      }
    }
  };

  axios.post('https://graph.facebook.com/v19.0/287252971133516/messages', data, { // Update with your phone number ID
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    res.json({
      success: true,
      data: response.data
    });
  })
  .catch(error => {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: error.response ? error.response.data.error.message : 'Error sending message'
    });
  });
});





const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

