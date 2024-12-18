const { MongoClient } = require('mongodb');

const uri = 'your-mongodb-uri'; // MongoDBの接続URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { text } = JSON.parse(event.body);

    try {
      await client.connect();
      const database = client.db('inputDB');
      const collection = database.collection('inputs');
      await collection.insertOne({ text, timestamp: new Date() });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Text saved successfully' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error saving text', error }),
      };
    } finally {
      await client.close();
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
};
