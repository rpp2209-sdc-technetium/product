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

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App listening on port ${process.env.SERVER_PORT}`)
});

const getPhotosAndSkus = (count, result, callback) => {
  if (count === result.results.length) {
    callback(null, result);
  }
  db.pool.query(`select thumbnail_url, url from photos where styleid = ${result.results[ count ][ 'style_id' ]}`)
  .then(data => {
    result.results[ count ][ 'photos' ] = data.rows;
    return db.pool.query(`select id, size, quantity from skus where styleid = ${result.results[ count ][ 'style_id' ]}`);
  })
  .then(data => {
    let newConfig = {};
    for (let j of data.rows) {
      newConfig[ j.id ] = {
        size: j.size,
        quantity: j.quantity,
      }
    }
    result.results[ count ][ 'skus' ] = newConfig;
    getPhotosAndSkus(count += 1, result, callback);
  })
  .catch(err => console.log(err));
}