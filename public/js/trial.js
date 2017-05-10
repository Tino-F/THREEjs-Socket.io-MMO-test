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

controls.addEventListener( 'change', () => {
  host.emit('move', {
    position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    },
    color: me.material.color
  });
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
