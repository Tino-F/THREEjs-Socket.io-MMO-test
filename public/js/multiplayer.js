var host = io.connect('http://localhost:1000/');

function add_user ( user ) {
  var shape_geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
  var shape_mesh = new THREE.MeshLambertMaterial( { color: user.color } );
  shape.position.set( user.position.x, user.position.y, user.position.z );
}

document.addEventListener('mousedown', () => {
  host.emit('change', {
    user: {
      position: {

          x: me.position.x,
          y: me.position.y,
          z: me.position.z
      },
      color: me.material.color
    }
  }
);})

host.on( 'change', function ( player ){ console.log( player ) } );
