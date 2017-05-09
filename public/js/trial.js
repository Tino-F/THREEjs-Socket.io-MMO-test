var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, WIDTH/HEIGHT, 0.01, 600);
camera.position.z = 100;
var scene = new THREE.Scene();
scene.updateMatrixWorld( true );
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( WIDTH, HEIGHT );
renderer.setClearColor( 0x000000 );
document.body.appendChild( renderer.domElement );
var controls = new THREE.TrackballControls( camera );

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

var shape_g = new THREE.ConeBufferGeometry( 40, 40, 40 );
var shape_m = new THREE.MeshLambertMaterial( { color: 0xffffff } );
var me = new THREE.Line( shape_g, shape_m );
scene.add( me );

function main () {
  requestAnimationFrame( main );
  renderer.render( scene, camera );
  controls.update();
}

main();

//socket.io

var host = io.connect('http://localhost:1000/');

function add_user ( user ) {
  var shape_geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
  var shape_mesh = new THREE.MeshLambertMaterial( { color: user.color } );
  shape.position.set( user.position.x, user.position.y, user.position.z );
}

document.addEventListener('mousedrag', () => {
  host.emit('change', {
    user: {
      position: {

          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
      },
      color: 0xffffff
    }
  }
);})

host.on( 'change', function ( player ){ console.log( player ) } );
