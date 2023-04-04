require('dotenv').config();
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});


pool.connect()
  .then(() => {
    console.log('Connected');
    // pool.query(`
    //   create type IntVarchar as (
    //     newInt int,
    //     newVarchar varchar (1000)
    //   );
    // `)

    // Creating table
    pool.query(`
    create table if not exists product (
    id int,
    name varchar (1000),
    slogan varchar (1000),
    description varchar (2000),
    category varchar (1000),
    default_price varchar (10)
  );
`)
      .then(console.log('Product table created'))
      .catch(err => console.log('Product table creation failed', err));

    pool.query(`
    create table if not exists styles (
    style_id int,
    product_id int,
    name varchar (1000),
    sale_price varchar (10),
    original_price varchar (10),
    "default?" boolean
  );
`)
      .then(console.log('Styles table created'))
      .catch(err => console.log('Styles table creation failed', err));

    pool.query(`
  create table if not exists features (
    id int,
    product_id int,
    feature varchar (1000),
    value varchar (1000)
  );
`)
      .then(console.log('Features table created'))
      .catch(err => console.log('Features table creation failed', err));

    pool.query(`
  create table if not exists related (
    id int,
    current_product_id int,
    related_product_id int
  );
`)
      .then(console.log('Related table created'))
      .catch(err => console.log('Related table creation failed', err));

    pool.query(`
  create table if not exists skus (
    id int,
    styleid int,
    size varchar (100),
    quantity int
  );
`)
      .then(console.log('Skus table created'))
      .catch(err => console.log('Skus table creation failed', err));


    pool.query(`
      create table if not exists photos (
        id int,
        styleId int,
        url text,
        thumbnail_url text
      );
    `)
      .then(console.log('Photos table created'))
      .catch(err => console.log('Photos table creation failed', err));

    // Creating index for quicker queries
    pool.query(`
        create index if not exists id_product_index on product (id);
      `)
      .then(() => console.log('Index has been created for product'))
      .catch(() => console.log('Index creation failed for product'));

    pool.query(`
        create index if not exists id_styles_index on styles (product_id);
      `)
      .then(() => console.log('Index has been created for styles'))
      .catch(() => console.log('Index creation failed for styles'));

    pool.query(`
        create index if not exists id_features_index on features (product_id);
      `)
      .then(() => console.log('Index has been created for features'))
      .catch(() => console.log('Index creation failed for features'));

    pool.query(`
        create index if not exists id_related_index on related (current_product_id);
      `)
      .then(() => console.log('Index has been created for related'))
      .catch(() => console.log('Index creation failed for related'));

    pool.query(`
      create index if not exists id_skus_index on skus (styleid);
      `)
      .then(() => console.log('Index has been created for skus'))
      .catch(() => console.log('Index creation failed for skus'));

    pool.query(`
      create index if not exists id_photos_index on photos (styleid);
      `)
      .then(() => console.log('Index has been created for photos'))
      .catch(() => console.log('Index creation failed for photos'));
  })
  .catch(err => {
    console.log('Connection failed')
    console.log('Error', err)
  })



module.exports = { pool };