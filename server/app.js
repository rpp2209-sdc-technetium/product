const express = require('express');
const app = express();
require('dotenv').config();
const dbQuery = require('../database/dbQuery.ts');

app.get('/products', (req, res) => {
  let page;
  let count;
  req.query.page ? page = req.query.page : page = 1;
  req.query.count ? count = req.query.count : count = 5;
  dbQuery.getAllData('product', page, count, (err, data) => {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/products/:product_id', (req, res) => {
  console.log(req.params)
  dbQuery.getProductId(req.params.product_id, (err, data) => {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/products/:product_id/styles', (req, res) => {
  dbQuery.getStyle(req.params.product_id, (err, data) => {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/products/:product_id/related', (req, res) => {
  dbQuery.getRelated(req.params.product_id, (err, data) => {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

module.exports = app;
