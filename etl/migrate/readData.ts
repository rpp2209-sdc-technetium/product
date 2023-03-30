const fs = require('fs.promises');
const dbQuery = require('../../database/dbQuery.ts');
const fsn = require('fs');

const databaseNames = [
  'features', 'product', 'related', 'skus', 'styles', 'photos'
];

for (let i of databaseNames) {
  dbQuery.etl(i, `/etl/data/${i}.csv`);
}