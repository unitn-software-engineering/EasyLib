import 'dotenv/config';
import mongoose from 'mongoose';
import Student from '../app/models/student.js';
import { hashPassword } from '../app/security/password.js';

function argument(name) {
    const index = process.argv.indexOf(`--${name}`);
    return index >= 0 ? process.argv[index + 1] : undefined;
}

const email = argument('email');
const password = argument('password');
if (!email || !password || password.length < 3) {
    console.error('Usage: npm run create-operator -- --email operator@example.com --password <password>');
    process.exit(1);
}
if (!process.env.DB_URL) {
    console.error('DB_URL is required');
    process.exit(1);
}

try {
    await mongoose.connect(process.env.DB_URL);
    const normalizedEmail = email.trim().toLowerCase();
    const operator = await Student.findOneAndUpdate(
        { email: normalizedEmail },
        { email: normalizedEmail, password: hashPassword(password), role: 'operator' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
    console.log(`Operator ${operator.email} is ready in the configured database.`);
} finally {
    await mongoose.disconnect();
}
