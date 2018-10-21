require( 'dotenv' ).config();
const express = require( 'express' );
const helmet = require( 'helmet' );
const compression = require( 'compression' );
const morgan = require( 'morgan' );
const path = require( 'path' );

const { Post, Author } = require( './sequelize' );
const apiVersion = 'v1';

const app = express();
app.use( helmet() );
app.use( compression() );
app.use( express.json() );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'hbs' );
app.use( morgan( 'short' ) );

app.get( '/', ( req, res ) => {
  res.status( 200 ).json( {
    apiVersion,
    endpoints: [
      'posts',
      'authors',
      'es5',
      'es6',
      'es7',
    ],
  } );
} );

app.get( '/es5', ( req, res ) => {
  Post.findAll()
    .then( result => {
      const posts = result.map( item => item.id );
      console.log( posts );
      res.render( 'es5', {
        posts,
      } );
    } )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.get( '/es6', ( req, res ) => {
  Post.findAll()
    .then( result => {
      const posts = result.map( item => item.id );
      console.log( posts );
      res.render( 'es6', {
        posts,
      } );
    } )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.get( '/es7', ( req, res ) => {
  Post.findAll()
    .then( result => {
      const posts = result.map( item => item.id );
      console.log( posts );
      res.render( 'es7', {
        posts,
      } );
    } )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.post( `/${apiVersion}/posts`, ( req, res ) => {
  Post.create( req.body )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.get( `/${apiVersion}/posts/:postId?`, ( req, res ) => {
  let query;

  if ( req.params.postId ) {
    query = Post.findByPk( req.params.postId );
  } else {
    query = Post.findAll();
  }

  query
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.patch( `/${apiVersion}/posts/:postId?`, ( req, res ) => {
  Post.update( req.body, {
    where: {
      id: req.params.postId,
    },
    fields: Object.keys( req.body ),
    returning: true,
  } )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.post( `/${apiVersion}/authors`, ( req, res ) => {
  Author.create( req.body )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.get( `/${apiVersion}/authors/:authorId?`, ( req, res ) => {
  let query;

  if ( req.params.authorId ) {
    query = Author.findByPk( req.params.authorId );
  } else {
    query = Author.findAll();
  }

  query
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.patch( `/${apiVersion}/authors/:authorId?`, ( req, res ) => {
  Author.update( req.body, {
    where: {
      id: req.params.authorId,
    },
    fields: Object.keys( req.body ),
    returning: true,
  } )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

app.listen( process.env.PORT );
