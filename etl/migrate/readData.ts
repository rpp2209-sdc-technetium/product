const fs = require('fs.promises');
const dbQuery = require('../../database/dbQuery.ts');
const fsn = require('fs');

// const databaseNames = [
//   'features', 'product', 'related', 'skus', 'styles', 'photos'
// ];
const databaseNames = [
  'skus', 'photos'
];

for (let i of databaseNames) {
  // dbQuery.etl(i, `/etl/data/${i}.csv`);
  // dbQuery.etl(i, `/Users/juhmal/Desktop/${i}.csv`);
  dbQuery.etl(i, `/home/ubuntu/${i}.csv`);
}

// fs.readFile(`/Users/juhmal/Desktop/product.csv`)
//   .then(data => console.log(data))
//   .catch(err => console.log(err));