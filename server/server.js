const express = require('express');
const cors = require('cors');
const helmet = require('helmet');


require('dotenv').config();

const app = express();
app.use(cors({
    // origin: 'https://timezone-front.onrender.com',
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => res.send('API TimeZone opérationnelle'));

// Routes
const authRoutes = require('./routes/authRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const exportRoutes = require('./routes/exportRoutes');
const congeRoutes = require('./routes/congeRoutes');
const dateBloqueeRoutes = require('./routes/dateBloqueeRoutes');
const userRoutes = require('./routes/userRoutes');
const heuresSuppRoutes = require('./routes/heuresSuppRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/conges', congeRoutes);
app.use('/api/dates-bloquees', dateBloqueeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/heures-supp', heuresSuppRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
