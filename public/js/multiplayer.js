var host = io.connect();
var players = [];
var player_data = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.001, 6000);
camera.position.z = 100;
var scene = new THREE.Scene();
scene.updateMatrixWorld( true );
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );
renderer.setClearColor( 0x000000 );
document.body.appendChild( renderer.domElement );
var controls = new THREE.TrackballControls( camera );

controls.addEventListener( 'change', function () {

  var user_data = {
    position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    },
    rotation: {
      x: camera.rotation.x,
      y: camera.rotation.y
    },
    color: center_geo.material.color
  };

  try {

    host.emit( 'move', user_data );

  } catch ( err ) {

    console.log( err );

  }

});

function randomNumber( min, max ) {
  return Math.floor(Math.random() * ( ( max - min ) + 1 ) + min );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
};

window.addEventListener('resize', onWindowResize, false);

var amb_light = new THREE.AmbientLight( { color: 0xffffff } );
scene.add( amb_light );

var shape_g = new THREE.SphereBufferGeometry( 40, 40, 40 );
var shape_m = new THREE.MeshNormalMaterial();
var center_geo = new THREE.Line( shape_g, shape_m );
scene.add( center_geo );

function main () {
  requestAnimationFrame( main );
  renderer.render( scene, camera );
  controls.update();
}

host.on( 'gimme_users', users => {

  console.log( 'User array: ', users );

  if ( users ) {

    players = [];
    player_data = [];

    for ( i=0; i < users.length; i++ ) {

      console.log( 'Received user,', users[ i ].Name, '.' );
      console.log( JSON.stringify( users[ i ] ) );

      console.log( 'Adding', users[ i ].Name, 'to scene.' );
      players.push( users[ i ].Name );
      player_data.push( users[ i ] );

      player_data[ i ].model = new THREE.Mesh( player_model_geometry, player_model_material );
      scene.add( player_data[ i ].model );

      player_data[ i ].model.position.set( users[ i ].position.x, users[ i ].position.y, users[ i ].position.z );
      player_data[ i ].model.rotation.x = users[ i ].rotation.x;

    }

  } else {

    console.log( "You're the only user!" );

  }

});

host.on( 'move', function ( user ){

  if ( !players.indexOf( user.Name ) ) {

    console.log( 'moving', user.Name );
    player_data[ players.indexOf( user.Name ) ].model.position.set( user.position.x, user.position.y, user.position.z );
    player_data[ players.indexOf( user.Name ) ].model.rotation.x = user.rotation.x;
    player_data[ players.indexOf( user.Name ) ].model.rotation.y = user.rotation.y;

  } else {

    console.log( 'Error, retreiving users.' );
    host.emit( 'gimme_users' );

  }

});

host.on( 'new_user', function( user ) {
  console.log( 'New user', user );

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );
  console.log( user );

  players.push( user.Name );
  player_data.push( { position: { x: user.x, y: user.y, z: user.z }, color: user.color, model: player_model } );

});

host.on( 'your_position', function ( data ) {

  console.log( 'your position is', data );

  camera.position.x = data.position.x;
  camera.position.y = data.position.y;
  camera.position.z = data.position.z;
  camera.lookAt( 0, 0, 0 );

  host.emit( 'move' );

} );

host.on( 'redirect', () => {
  window.location = '/';
});


host.on( 'user_disconnect', Name => {
  let index = players.indexOf( Name );
  console.log( 'Player,', Name, 'disconnected.');
  console.log( 'Removing player from scene...' );
  scene.remove( player_data[ index ].model );
  players.splice( index );
  player_data.splice( index )
} );

main();

host.emit( 'your_position' );
host.emit( 'gimme_users' );
