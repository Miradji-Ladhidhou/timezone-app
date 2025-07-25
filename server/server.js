const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => res.send('API TimeZone opérationnelle'));

// Routes
const authRoutes = require('./routes/authRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const exportRoutes = require('./routes/exportRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/export', exportRoutes);


// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
