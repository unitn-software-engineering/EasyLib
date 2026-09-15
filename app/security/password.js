import crypto from 'crypto';

const KEY_LENGTH = 64;

export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password, storedPassword) {
    if (typeof password !== 'string' || typeof storedPassword !== 'string') {
        return false;
    }

    if (!storedPassword.startsWith('scrypt$')) {
        const actual = Buffer.from(password);
        const expected = Buffer.from(storedPassword);
        return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
    }

    const [, salt, expectedHex] = storedPassword.split('$');
    if (!salt || !expectedHex) return false;

    const actual = crypto.scryptSync(password, salt, KEY_LENGTH);
    const expected = Buffer.from(expectedHex, 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

export function randomPassword() {
    return crypto.randomBytes(32).toString('hex');
}
