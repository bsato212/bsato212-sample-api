require( 'dotenv' ).config();
const express = require( 'express' );
const helmet = require( 'helmet' );
const compression = require( 'compression' );
const morgan = require( 'morgan' );
const path = require( 'path' );

const { Post, Author } = require( './sequelize' );
const apiVersion = 'v1';

const { GraphQLServer } = require( 'graphql-yoga' );
const typeDefs = `
  type Query {
    posts: [Post!]!
    authors: [Author!]!
    post(id: ID): Post!
    author(id: ID): Author!
  }

  type Post {
    id: ID!
    authorId: ID!
    title: String!
    body: String!
    createdAt: String!
    updatedAt: String!
  }

  type Author {
    id: ID!
    firstName: String!
    lastName: String!
    createdAt: String!
    updatedAt: String!
  }
`;

const resolvers = {
  Query: {
    posts: async () => {
      return await Post.findAll();
    },
    authors: async () => {
      return await Author.findAll();
    },
    post: async ( _, { id } ) => {
      return await Post.findByPk( id );
    },
    author: async ( _, { id } ) => {
      return await Author.findByPk( id );
    },
  },
};

const server = new GraphQLServer( {
  typeDefs,
  resolvers,
} );

server.express.use( helmet() );
server.express.use( compression() );
server.express.use( express.json() );
server.express.set( 'views', path.join( __dirname, 'views' ) );
server.express.set( 'view engine', 'hbs' );
server.express.use( morgan( 'short' ) );

server.express.get( '/', ( req, res ) => {
  res.status( 200 ).json( {
    apiVersion,
    endpoints: [
      'posts',
      'authors',
      'es5',
      'es6',
      'es7',
      'graphql',
      'subscriptions',
      'playground',
    ],
  } );
} );

server.express.get( '/es5', ( req, res ) => {
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

server.express.get( '/es6', ( req, res ) => {
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

server.express.get( '/es7', ( req, res ) => {
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

server.express.post( `/${apiVersion}/posts`, ( req, res ) => {
  Post.create( req.body )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

server.express.get( `/${apiVersion}/posts/:postId?`, ( req, res ) => {
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

server.express.patch( `/${apiVersion}/posts/:postId?`, ( req, res ) => {
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

server.express.post( `/${apiVersion}/authors`, ( req, res ) => {
  Author.create( req.body )
    .then( result => res.json( result ) )
    .catch( error => res.status( 500 ).json( error ) );
} );

server.express.get( `/${apiVersion}/authors/:authorId?`, ( req, res ) => {
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

server.express.patch( `/${apiVersion}/authors/:authorId?`, ( req, res ) => {
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

server.start( {
  port: process.env.PORT,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
  debug: true,
} );
