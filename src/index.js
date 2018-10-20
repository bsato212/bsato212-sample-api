const express = require( 'express' );
const helmet = require( 'helmet' );
const compression = require( 'compression' );
const morgan = require( 'morgan' );

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

app.listen( process.env.PORT || 3000 );
