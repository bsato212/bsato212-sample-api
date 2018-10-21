const Sequelize = require( 'sequelize' );
const PostModel = require( './models/post' );
const AuthorModel = require( './models/author' );

const sequelize = new Sequelize( process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: process.env.NODE_ENV !== 'development',
  },
} );

const Post = PostModel( sequelize, Sequelize );
const Author = AuthorModel( sequelize, Sequelize );

sequelize.sync( {
  alter: true,
} )
  .then( () => {
    console.log( 'database tables created' );
  } );

module.exports = {
  Post,
  Author,
};
