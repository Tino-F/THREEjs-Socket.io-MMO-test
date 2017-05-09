'use strict';
const url = 'mongodb://localhost:27017/';
const MongoClient = require('mongodb').MongoClient;

exports.encrypt = ( text ) => {

};

exports.decrypt = ( text ) => {

};

exports.random = ( min, max ) => {
  return Math.floor( Math.random() * ( max - min + 1 ) + min );
};

exports.find_user = ( q, callback ) => {
  let user;

  MongoClient.connect(url, ( err, db ) => {

    if ( !err ) {
      let Profiles = db.collection('Profiles');

      Profiles.find( q ).limit(1).toArray( ( err, item ) => {
        if ( !err ) {

          if (!item[0]) {
            callback( false, false );
          } else {
            callback( false, item[0] );
          }

        } else {
          callback( err, false)
          console.log( 'Failed to find user using query: ', q, '.\n' );
          console.log( err );
        }
      });

    } else {
      callback( err, false );
      console.log( 'Failed to connect to server' );
    }

    db.close();

  });
};

exports.home = ( req, res ) => {
  if ( !req.isAuthenticated() ) {
    res.redirect( '/login' );
  } else {
    res.render( 'world', {user: req.user} );
  }
};

exports.login = ( req, res ) => {
  if ( req.isAuthenticated() ) {
    res.render( 'login', { err: 'Your are currently logged in as ' + req.user.Name });
  } else {
    res.render( 'login' );
  }
};

exports.login_post = ( req, res ) => {
  if( req.isAuthenticated() ) {
    res.redirect( '/' );
  } else {
    res.render( 'login', { err: 'Login failed.' } );
  }
};

exports.register = ( req, res ) => {
  if ( req.isAuthenticated() ) {
    res.render('register', {err: 'You are currently logged in as another user.'});
  } else {
    res.render('register');
  }
};

exports.register_post = ( req, res ) => {

  let new_user = {
    Name: req.body.username,
    Password: req.body.password,
    Color: req.body.color
  };

  console.log( new_user );

  MongoClient.connect(url, ( err, db ) => {
    if ( !err ) {

      db.collection('Profiles').insert( new_user, (err, r) => {
        if ( !err ) {
          console.log('Sucessfully added new user.')
          res.redirect('/login');
        } else {
          res.render( 'register', { err: 'Registration failed due to an nternal server error. Please try again later.' } );
        }
      });

    } else {
      console.log('Failed to connect to database');
      res.render( 'register', { err: 'Registration failed due to an nternal server error. Please try again later.' } );
    }
    db.close();
  });
};
