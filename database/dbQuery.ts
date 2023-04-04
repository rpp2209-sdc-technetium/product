const db = require('./db.ts');


const getAllData = (tableName, page, count, callback) => {
  let selectAllQuery = `select * from ${tableName} `;
  let limitQuery = `limit ${count} `;
  let offsetQuery = `offset ${count * (page - 1)};`
  db.pool.query(selectAllQuery + limitQuery + offsetQuery)
    .then(data => callback(null, data.rows))
    .catch(err => callback(err, null));
};



// getAllData('product', 1, 5, (data) => {
//   console.log(data);
// })

const getProductId = (product_id, callback) => {
  let productIdQuery = `select * from product where id = ${product_id}`;
  let featureProductIdQuery = `select feature, value from features where product_id = ${product_id};`
  db.pool.query(productIdQuery)
    .then(dataProduct => {
      db.pool.query(featureProductIdQuery)
        .then(dataFeature => {
          callback(null, { ...dataProduct.rows[ 0 ], features: dataFeature.rows });
        })
        .catch(err => callback(err, null));
    })
    .catch(err => callback(err, null));
};

// getProductId(11, (data) => {
//   console.log(data);
// })


const getRelated = (product_id, callback) => {
  db.pool.query(`select related_product_id from related where current_product_id = ${product_id};`)
    .then(data => {
      let resultArr = [];
      for (let i of data.rows) {
        resultArr.push(i.related_product_id);
      }
      callback(resultArr);
    })
    .catch(err => callback());
};

// getRelated(1, (data) => {
//   console.log(data);
// })

const getStyle = (product_id, callback) => {
  let result = {
    product_id: product_id.toString(),
    results: null
  };
  db.pool.query(`select style_id, name, sale_price, original_price, "default?" from styles where product_id = ${product_id};`)
    .then(data => {
      result.results = data.rows;
      for (let i = 0; i < result.results.length; i++) {
        if (result.results[ i ][ 'sale_price' ] === 'null') {
          result.results[ i ][ 'sale_price' ] = '0';
        }
        //   db.pool.query(`select thumbnail_url, url from photos where styleid = ${result.results[ i ][ 'style_id' ]}`)
        //     .then(data => {
        //       result.results[ i ][ 'photos' ] = data.rows;
        //     })
        //     .catch(err => console.log(err));

        //   db.pool.query(`select id, size, quantity from skus where styleid = ${result.results[ i ][ 'style_id' ]}`)
        //     .then(data => {
        //       let newConfig = {};
        //       for (let j of data.rows) {
        //         newConfig[ j.id ] = {
        //           size: j.size,
        //           quantity: j.quantity,
        //         }
        //       }
        //       result.results[ i ][ 'skus' ] = newConfig;
        //     })
        //     .catch(err => console.log(err));
      }
      getPhotosAndSkus(0, result, callback);
    })
    .catch(err => console.log(err));

};

const getPhotosAndSkus = (count, result, callback) => {
  if (count === result.results.length) {
    callback(null, result);
  } else {
    db.pool.query(`select thumbnail_url, url from photos where styleid = ${result.results[ count ][ 'style_id' ]}`)
      .then(data => {
        result = { ...result }
        result.results[ count ][ 'photos' ] = data.rows;
        return db.pool.query(`select id, size, quantity from skus where styleid = ${result.results[ count ][ 'style_id' ]}`);
      })
      .then(data => {
        // result = { ...result }
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
}

// getStyle(1, (err, data) => {
//   console.log(data)
// })


const etl = (tableName, filePath) => {
  console.log(`\\copy ${tableName} from '${filePath}' delimiter ',' csv header`)
  db.pool.query(`copy ${tableName} from '${filePath}' delimiter ',' csv header`)
    .then(() => {
      console.log(`Data has been inserted into ${tableName}`);
    })
    .catch(err => console.log(`Inserting data into ${tableName} has failed`, err));
};

module.exports = { etl, getAllData, getProductId, getRelated, getStyle };