var host = io.connect('http://localhost:1000/');
var players = [];
var player_data = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

function getUsers () {

  socket.emit( 'gimme_users', users => {

    for ( i=0; i < users.length; i++ ) {
      players[ i ] = users[ i ].Name;
      player_data[ i ] = users[ i ].Data;

      var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
      scene.add( player_model );
      player.data[ i ] = player_model;

      player_data[ i ].model.position.set( user[ i ].position.x, user[ i ].position.y, user[ i ].position.z );
    }

  });

};

host.on( 'move', function ( user ){

  try {
    player_data[ players.indexOf( user.Name ) ].model.position.set( user.position.x, user.position.y, user.position.z );
    console.log( user.x, user.y, user.z );
    console.log( JSON.stringify( user ) );
  } catch ( err ) {

  }

});

host.on( 'new_user', function( user ) {

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );

  players.push( user.Name );
  player_data.push( { position: { x: user.x, y: user.y, z: user.z }, color: user.color, model: player_model } );

});
