const mongoose = require('mongoose');

const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  return connection.connection;
};

module.exports = connectDB;
