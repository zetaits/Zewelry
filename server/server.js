require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/stripe', stripeRoutes);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
