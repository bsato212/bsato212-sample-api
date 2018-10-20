require( 'dotenv' ).config();
const express = require( 'express' );
const helmet = require( 'helmet' );
const compression = require( 'compression' );
const morgan = require( 'morgan' );
const { Client } = require( 'pg' );

const client = new Client( {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
} );
client.connect();

const app = express();
app.use( helmet() );
app.use( compression() );
app.use( express.json() );
app.use( morgan( 'short' ) );

app.get( '/', ( req, res ) => {
  res.status( 200 ).json( {
    message: 'Hello World!',
  } );
} );

app.get( '/pgtest', ( req, res ) => {
  const sql = 'SELECT table_schema,table_name FROM information_schema.tables;';

  client.query( sql, ( error, result ) => {
    if ( error ) {
      console.error( error );
      res.status( 500 ).json( {
        message: error.message,
      } );
    }

    res.status( 200 ).json( result );
  } );
} );

app.listen( process.env.PORT );
