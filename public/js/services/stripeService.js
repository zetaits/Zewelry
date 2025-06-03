export async function createStripeCheckoutSession(cartItems) {
  try {
    const res = await fetch('http://localhost:4242/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems })
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error('Error creating checkout session:', data);
      alert('Error creating checkout session. Please try again.');
    }
  } catch (error) {
    console.error('Fetch error during Stripe session creation:', error);
    alert('Could not connect to payment processor. Please check your internet connection and try again.');
  }
}
