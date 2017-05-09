var host = io.connect('http://localhost:1000/');
var players = [];
var player_model_geometry = new THREE.BoxBufferGeometry( 40, 40, 40);
var player_model_material = new THREE.MeshLambertMaterial( { color: 0xffffff } );


document.addEventListener('mousemove', () => {
  host.emit('change', {
    user: {
      position: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
      },
      color: me.material.color
    }
  }
);})

host.on( 'change', function ( player ){ console.log( player ) } );

host.on( 'new_user', function( user_data ) {
  var user = user_data.user;
  console.log( 'New user:', user.Name );
  console.log( 'Position: (', user.position.x, user.position.y, user.position.z, ')' );

  var player_model = new THREE.Mesh( player_model_geometry, player_model_material );
  player_model.position.set( user.position.x, user.position.y, user.position.z );
  scene.add( player_model );

  players.push( { user: user, player: player_model } );
});
