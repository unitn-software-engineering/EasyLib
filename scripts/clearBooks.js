import 'dotenv/config'
import mongoose from 'mongoose';
import Books from '../app/models/book.js';

mongoose.connect(process.env.DB_URL)
.then( async () => {
	console.log("Connected to Database")
	await Books.deleteMany().exec()
	console.log("Books removed")
	process.exit(0);
});



