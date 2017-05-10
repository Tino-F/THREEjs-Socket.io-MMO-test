var host = io.connect('http://localhost:1000/');
var players = [];
var player_data = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

host.on( 'move', function ( user ){

  try {
    player_data[ players.indexOf( user.Name ) ].model.position.set( user.position.x, user.position.y, user.position.z );
    console.log( user.x, user.y, user.z );
    console.log( JSON.stringify( user ) );
  } catch ( err ) {
    console.log( "Can't remotely move your own player..." );
    console.log( err );
  }

 } );

host.on( 'new_user', function( user ) {

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );

  players.push( user.Name );
  player_data.push( { position: { x: user.x, y: user.y, z: user.z }, color: user.color, model: player_model } );

});
