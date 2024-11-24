require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);  
app.use('/user', userRoutes);  

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});