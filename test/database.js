import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let server;

export async function connectTestDatabase() {
    server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());
}

export async function disconnectTestDatabase() {
    await mongoose.disconnect();
    await server?.stop();
    server = undefined;
}

export async function clearTestDatabase() {
    const collections = Object.values(mongoose.connection.collections);
    await Promise.all(collections.map((collection) => collection.deleteMany({})));
}
