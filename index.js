"use strict";
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrat = require('passport-local').Strategy;
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const expresssession = require('express-session');
const socketsession = require('express-socket.io-session');
const app = express();
const url = 'mongodb://localhost:27017/';
const invisible = require('./invisible');
const session = expresssession({
  secret: 'fxxxxxxkeoiarjeajd',
  resave: false,
  saveUninitialized: false
});

app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( cookieParser() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( session );
app.use( passport.initialize() );
app.use( passport.session() );
app.set( 'view engine', 'pug' );

passport.use( new LocalStrat( ( username, password, done ) => {

  invisible.find_user( { Name: username }, ( err, user ) => {
    if ( !err ) {
      if ( !user ) {
        done( null, null, 'Invalid username.' );
      } else {
        if ( password === user.Password ) {
          done( null, user );
        } else {
          done( null, null, 'Incorrect password.' );
        }
      }
    } else {
      console.log( err );
      done( null, null, 'Authentication failed due to an internal server error.' );
    }
  });

}));

passport.serializeUser( ( user, done ) => done( null, user ) );
passport.deserializeUser( ( user, done ) => done( null, user ) );

const server = require( 'http' ).Server( app );
const io = require( 'socket.io' )( server );
server.listen( 3000 );
console.log( 'Listening on port 3000.' );

io.use(socketsession(session, {
    autoSave: true
} ));

var users = [];
var user_data = [];

function new_user ( socket ) {

  console.log( socket.handshake.session.passport.user.Name, 'connected.' );

  let user = {
      position: {
        x: invisible.random( -400, 400 ),
        z: invisible.random( -400, 400 ),
        y: invisible.random( -400, 400 )
      },
      rotation: {
        x: false,
        y: false
      },
      color: socket.handshake.session.passport.user.color,
      Name: socket.handshake.session.passport.user.Name
  };

  user_data.push( user );
  users.push( socket.handshake.session.passport.user.Name );
  socket.broadcast.emit( 'new_user', user_data[ users.indexOf( socket.handshake.session.passport.user.Name ) ] );
  socket.emit( 'your_position', user_data[ users.indexOf( socket.handshake.session.passport.user.Name ) ] );

};

io.on('connection', socket => {

  new_user( socket );

  socket.on( 'your_position', () => {
    socket.emit( 'your_position', user_data[ users.indexOf( socket.handshake.session.passport.user.Name ) ] );
  });

  socket.on( 'gimme_users', () => {
    socket.emit( 'gimme_users', user_data );
  })

  socket.on( 'move', player => {

    if ( player ) {
      player.Name = socket.handshake.session.passport.user.Name;
      user_data[ users.indexOf( player.Name ) ] = player;
      socket.broadcast.emit( 'move', user_data[ users.indexOf( player.Name ) ] );
    }

  });

  socket.on( 'disconnect', () => {
    socket.broadcast.emit( 'user_disconnect', socket.handshake.session.passport.user.Name );
    user_data.splice( users.indexOf( socket.handshake.session.passport.user.Name ), 1 );
    users.splice( users.indexOf( socket.handshake.session.passport.user.Name ), 1 );
  } );
})

app.get( '/', invisible.home );
app.get( '/login', invisible.login );
app.post( '/login', ( req, res ) => {
  passport.authenticate( 'local', ( info, user, err ) => {
    if ( !err ) {
      req.logIn( user, ( err ) => {
        if ( !err ) {
          return res.redirect( '/' );
        } else {
          return res.render( 'login', { err: 'Internal server error.' } );
        }
      });
    } else {
      return res.render( 'login', { err: err } );
    }
  })( req, res );
} );
app.get( '/register', invisible.register );
app.post( '/register', invisible.register_post );
