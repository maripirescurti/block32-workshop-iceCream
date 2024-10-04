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
  let SQL = ``;
  await client.query(SQL);
  console.log('tables created');
  SQL = ``;
  await client.query(SQL);
  console.log('data seeded');
}

init ();