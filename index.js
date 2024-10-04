// imports for express and pg
const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_icecream_flavors_db')
const app = express()

// static routes here

// app routes here

// init function here
const init  = async () => {
  await client.connect();
  console.log('connected to database');
  let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = `
    INSERT INTO flavors(name, is_favorite) VALUES('chocolate', false);
    INSERT INTO flavors(name, is_favorite) VALUES('vanilla', false);
    INSERT INTO flavors(name, is_favorite) VALUES('caramel', false);
    INSERT INTO flavors(name, is_favorite) VALUES('pistacchio', true);
    INSERT INTO flavors(name, is_favorite) VALUES('mango', true);
    INSERT INTO flavors(name, is_favorite) VALUES('coconut', false);
    INSERT INTO flavors(name, is_favorite) VALUES('strawberry', false);
  `;
  await client.query(SQL);
  console.log('data seeded');
}

init ();