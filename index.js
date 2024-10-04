// imports for express and pg
const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_icecream_flavors_db');
const app = express();

// static routes here

// app routes here

// parse body into JS objects
app.use(express.json());
// log requests as they come in
app.use(require('morgan')('dev'));

// Create flavors - C
app.post('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `
      INSERT INTO flavors(name, is_favorite)
      VALUES($1, $2)
      RETURNING *
    `;
    const response = await client.query(SQL, [req.body.name, req.body.is_favorite || false]);
    res.send(response.rows[0])
  } catch (ex) {
    next(ex)
  }
});

// Read flavors - R
app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from flavors ORDER BY created_at DESC;
    `;
    const response = await client.query(SQL);
    res.send(response.rows)
  } catch (ex) {
    next(ex)
  }
});

// Read single flavor - R
app.get('/api/flavors/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `
      SELECT * FROM flavors WHERE id = $1;
    `;
    const response = await client.query(SQL, [id]);
    if (response.rows.length === 0) {
      return res.status(404).send({ message: 'Flavor not found'});
    }
    res.send(response.rows[0]);
  } catch (ex) {
    next(ex)
  }
});

// Update flavors - U
app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `
      UPDATE flavors
      SET name=$1, is_favorite=$2, updated_at= now()
      WHERE id=$3 RETURNING *;
    `;
    const response = await client.query(SQL, [req.body.name, req.body.is_favorite, req.params.id]);
    res.send(response.rows[0])
  } catch (ex) {
    next(ex)
  }
});

// Delete Favors - D
app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `
      DELETE from flavors
      WHERE id = $1
    `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204)
  } catch (ex) {
    next(ex)
  }
});

// init function here
const init  = async () => {
  await client.connect();
  console.log('connected to database');
  let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
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
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
}

init ();