const { MongoClient } = require('mongodb');

const uri = 'your-mongodb-uri'; // MongoDB AtlasのURIを記入
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      // MongoDB接続
      await client.connect();
      const database = client.db('inputDB');
      const collection = database.collection('inputs');
      const data = await collection.find().toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error fetching data', error }),
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
