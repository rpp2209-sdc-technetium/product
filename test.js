require("dotenv").config();
const request = require("supertest");
const app = require('./server/app');

describe('Testing /products', () => {
  test('Get a 200 status', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(200);
  });

  test('Get an array of 5 when count is not given', async () => {
    const res = await request(app).get('/products');
    expect(res.body.length).toBe(5);
  });

  test('Get an array of 10 when count is equal to 10', async () => {
    const res = await request(app).get('/products')
    .query({ count: 10 });
    expect(res.body.length).toBe(10);
  });

  test('Get 2 different product ids when page changes', async() => {
    const res1 = await request(app).get('/products')
    .query({ count: 1, page: 1 });
    const res2 = await request(app).get('/products')
    .query({ count: 1, page: 2 });
    expect(res1.body[0].id).toBe(res2.body[0].id - 1);
  });
});