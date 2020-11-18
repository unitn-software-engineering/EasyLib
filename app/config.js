/**
 * https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
 */

// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT
};

module.exports = {

	superSecret: process.env.SUPER_SECRET || 'is2lab2020',
	database: {
		uri: process.env.DB_URL //|| 'mongodb+srv://admin:GiiiYyXyPkj2hiI1@cluster0.f9mww.mongodb.net/Cluster0?retryWrites=true&w=majority',
	}
	
};