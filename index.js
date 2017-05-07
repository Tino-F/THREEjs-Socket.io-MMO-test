"use strict";
const MongoClient = require('mongodb').MongoClient;
const sass = require('node-sass-middleware');
const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const expresssession = require('express-session');
const app = express();
const url = 'mongodb://localhost:27017/';
const invisible = require('./invisible');

app.use( sass({
  src: path.join( __dirname, 'public' ),
  dest: path.join( __dirname, 'public' )
}) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( cookieParser() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( expresssession({
  secret: 'fxxxxxxkeoiarjeajd',
  resave: false,
  saveUninitialized: false
}) );
app.use( passport.initialize() );
app.use( passport.session() );
app.set( 'view engine', 'pug' );

passport.use( new LocalStrat( ( username, password, done ) => {

  invisible.find_user( { Name: username }, ( err, user ) => {
    if ( !err ) {
      if ( !user ) {
        done( null, false, { err: 'Invalid username.' } );
      } else {
        if ( password === user.Password ) {
          done( false, user );
        } else {
          done( null, false, { err: 'Incorrect password.' } );
        }
      }
    } else {
      cosnole.log( err );
      done( null, false, { err: 'Authentication failed due to an internal server error.' } );
    }
  });

}));

passport.serializeUser( (user, done) => done( null, user ) );
passport.deserializeUser( ( user, done ) => done( null, user ) );

const server = require('http').Server( app );
const io = require('socket.io')( server );
server.listen( 1000 );
console.log( 'Listening on port 1000.' );

/*
io.on('connection', socket => {

  console.log(socket);

})
*/

app.get( '/', invisible.home );

app.get( '/login', invisible.login );
app.post( '/login', passport.authenticate('local'), invisible.login_post );

app.get( '/register', invisible.register );
app.post( '/register', invisible.register_post );
