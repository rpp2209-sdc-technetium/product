const express = require('express');
const app = express();
require('dotenv').config();
const dbQuery = require('../database/dbQuery.ts');
const axios = require('axios');
var cors = require('cors');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded());
// app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(path.join(__dirname,'../../FECv2/dist')));
// app.use('/:product_id', express.static(path.join(__dirname,'../../FECv2/dist')));



app.post('/products', (req, res) => {
  const product_id = req.body.product_id;
  dbQuery.getProductId(product_id, (err, data) => {
    if (data) {
      // console.log('data', data)
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

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

app.get('/:product_id', (req, res) => {
  console.log(req.params, req.query)
  // axios.get(`http://localhost:3000/products/${req.params.product_id}`, (err, data) => {
  //   if (data) {
  //     res.status(200).send(data.data);
  //   } else {
  //     res.status(500).send(err)
  //   }
  // })
  dbQuery.getProductId(req.params.product_id, (err, data) => {
    if (data) {
      console.log('data', data)
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/products/:product_id', (req, res) => {
  dbQuery.getProductId(req.params.product_id, (err, data) => {
    if (data) {
      // console.log('data', data)
      res.status(200).send(data);
    } else {
      res.status(500).send(err);
    }
  });
});

app.get('/products/:product_id/styles', (req, res) => {
  dbQuery.getStyle(req.params.product_id, (err, data) => {
    console.log(data)
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
