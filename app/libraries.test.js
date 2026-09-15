import request from 'supertest';
import app from './app.js';

describe('Libraries API', () => {
  test('returns libraries filtered by municipality', async () => {
    const response = await request(app).get('/api/v1/libraries?municipality=Trento').expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.every((library) => library.municipality === 'Trento')).toBe(true);
  });

  test('returns an empty array when no library matches', async () => {
    await request(app).get('/api/v1/libraries?municipality=Unknown').expect(200, []);
  });
});
