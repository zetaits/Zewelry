const stripe = require('../config/stripe');

exports.createCheckoutSession = async (req, res) => {
  const { cartItems } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: [item.image || ''],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:8000/success.html',
      cancel_url: 'http://localhost:8000/view-cart.html',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
