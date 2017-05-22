var host = io.connect('http://localhost:3000/');
var players = [];
var player_data = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

host.on( 'gimme_users', users => {

  console.log( 'User array: ', users );

  if ( users ) {
    for ( i=0; i < users.length; i++ ) {

      console.log( 'Received user,', users[ i ].Name, '.' );

      players.push( users[ i ].Name );
      player_data.push( users[ i ] );

      player_data[ i ].model = new THREE.Mesh( player_model_geometry, player_model_material );
      scene.add( player_data[ i ].model );

      console.log( JSON.stringify( users[ i ] ) );

      player_data[ i ].model.position.set( users[ i ].position.x, users[ i ].position.y, users[ i ].position.z );
      player_data[ i ].model.rotation.x = users[ i ].rotation.x;

    }

  }

});

host.emit( 'gimme_users' );

host.on( 'move', function ( user ){

  try {
    player_data[ players.indexOf( user.Name ) ].model.position.set( user.position.x, user.position.y, user.position.z );
    player_data[ players.indexOf( user.Name ) ].model.rotation.x = user.rotation.x;
    player_data[ players.indexOf( user.Name ) ].model.rotation.y = user.rotation.y;
  } catch ( err ) {
    console.log( err );
  }

});

host.on( 'new_user', function( user ) {
  console.log( 'New user', user );

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );

  players.push( user.Name );
  player_data.push( { position: { x: user.x, y: user.y, z: user.z }, color: user.color, model: player_model } );

});

host.on( 'your_position', data => {

  console.log( 'your position is...' );
  console.log( data );

  camera.position.x = data.position.x;
  camera.position.y = data.position.y;
  camera.position.z = data.position.z;
  camera.lookAt( 0, 0, 0);

  host.emit( 'move' );

} );

host.on( 'redirect', () => {
  window.location = '/';
});

host.emit( 'your_position' );


host.on( 'user_disconnect', Name => {
  let index = players.indexOf( Name );
  console.log( 'Player,', Name, 'disconnected.');
  scene.remove( player_data[ index ].model );
  players.splice( index );
  player_data.splice( index )
} );
