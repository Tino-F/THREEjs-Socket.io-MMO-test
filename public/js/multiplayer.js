var host = io.connect('http://localhost:1000/');
var players = [];
var player_data = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

host.emit( 'gimme_users', users => {

  console.log( 'User array: ', users );

  for ( i=0; i < users.length; i++ ) {

    console.log( 'Received user,', users[ i ].Name, '.' );

    players.push( users[ i ].Name );
    player_data.push( users[ i ] );

    player.data[ i ].model = new THREE.Mesh( player_model_geometry, player_model_material );
    scene.add( player.data[ i ].model );

    player_data[ i ].model.position.set( user[ i ].position.x, user[ i ].position.y, user[ i ].position.z );
    player_data[ i ].model.rotation.x = user[ i ].rotation.x;
    player_data[ i ].model.rotation.y = user[ i ].rotation.y;

  }

});

host.on( 'move', function ( user ){

  try {
    player_data[ players.indexOf( user.Name ) ].model.position.set( user.position.x, user.position.y, user.position.z );
    player_data[ players.indexOf( user.Name ) ].model.rotation.x = user.rotation.x;
    player_data[ players.indexOf( user.Name ) ].model.rotation.y = user.rotation.y;
  } catch ( err ) {

  }

});

host.on( 'new_user', function( user ) {
  console.log( user );

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );

  players.push( user.Name );
  player_data.push( { position: { x: user.x, y: user.y, z: user.z }, color: user.color, model: player_model } );

});

host.on( 'your_position', data => {
  camera.position.x = data.position.x;
  camera.position.y = data.position.y;
  camera.position.z = data.position.z;
  camera.lookAt( 0, 0, 0);
} );


host.on( 'user_disconnect', Name => {
  let index = players.indexOf( Name );
  console.log( 'Player,', Name, 'disconnected.');
  scene.remove( player_data[ index ].model );
  players.splice( index );
  player_data.splice( index )
} );
