const mongoose = require('mongoose');
const {dbName} = require('./constants.js');

mongoose.connect(process.env.MONGO_URI, {
  dbName, 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
