const mongoo = require('mongoose');
require('dotenv').config();

const connectionString = process.env.MONGO;

const connection = () => {
  try {
    mongoo.connect(connectionString);
    console.log('Connected to the database');
  } catch (error) {
    console.log('Error connecting to the database');
  }
};

module.exports = connection;
