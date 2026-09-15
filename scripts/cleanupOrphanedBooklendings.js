import 'dotenv/config';
import mongoose from 'mongoose';
import Booklending from '../app/models/booklending.js';
import '../app/models/book.js';
import '../app/models/student.js';

const apply = process.argv.includes('--apply');

if (!process.env.DB_URL) {
    console.error('DB_URL is required');
    process.exit(1);
}

try {
    await mongoose.connect(process.env.DB_URL);
    const lendings = await Booklending.find()
        .populate('book', '_id title')
        .populate('student', '_id email')
        .exec();
    const orphaned = lendings.filter((lending) => !lending.book || !lending.student);

    if (orphaned.length === 0) {
        console.log('No orphaned booklendings found.');
    } else {
        console.log(`${orphaned.length} orphaned booklending(s) found:`);
        for (const lending of orphaned) {
            console.log([
                String(lending._id),
                `status=${lending.status || 'unknown'}`,
                `book=${lending.book?.title || 'MISSING'}`,
                `student=${lending.student?.email || 'MISSING'}`
            ].join(' | '));
        }

        if (apply) {
            const result = await Booklending.deleteMany({ _id: { $in: orphaned.map((lending) => lending._id) } }).exec();
            console.log(`Removed ${result.deletedCount} orphaned booklending(s).`);
        } else {
            console.log('Dry run only. Repeat with --apply to remove these records.');
        }
    }
} finally {
    await mongoose.disconnect();
}
