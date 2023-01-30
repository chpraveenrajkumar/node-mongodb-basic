const { MongoClient } = require('mongodb');

let dbConnection;
module.exports = {
  connectToDB: (cb) => {
    const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.wmeznjf.mongodb.net/?retryWrites=true&w=majority`;
    MongoClient.connect(url)
      .then((client) => {
        dbConnection = client;
        return cb(); // runs after connection is established
      })
      .catch((e) => {
        console.error(e);
        return cb(e);
      });
  },
  getDB: () => dbConnection,
};
