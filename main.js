import Experience from "./Experience/Experience";

const experience = new Experience(); 

// import * as THREE from 'three';
// import { Clock } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// // Base setup
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({
//     antialias: true
// });
// const controls = new OrbitControls(camera, renderer.domElement);
 
// renderer.setSize(innerWidth, innerHeight);
// document.body.appendChild(renderer.domElement);
// document.body.style.margin = 0;

// // Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight);

// //Models

// const gltfLoader = new GLTFLoader();
// let mixer = null;
// gltfLoader.load(
//     '/assets/models/Fox/glTF/Fox.gltf',
//     (gltf) => {
//         console.log(gltf);

//         mixer = new THREE.AnimationMixer(gltf.scene);
//         const action = mixer.clipAction(gltf.animations[2])

//         action.play();

//         gltf.scene.scale.set(0.02, 0.02, 0.02);
//         scene.add(gltf.scene);

//         // option 4: best
//         // const children =  [...gltf.scene.children];
//         // for( const child of children ){
//         //     scene.add(child);
//         // }
//         // console.log(children);
//     }
// )


// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({ 
//         color: 0x808080, 
//         side: THREE.DoubleSide 
//     })
// );

// floor.rotation.x = - Math.PI * 0.5;
// scene.add(floor);

// camera.position.set(0, 2, 5);
// camera.lookAt(0, 0, 0);
// controls.target.set(0, 0, 0);

// const clock = new Clock();
// let previousTime = 0;
// function animation() {
//     const elapsedtime = clock.getElapsedTime();
//     const deltaTime = elapsedtime - previousTime;
//     previousTime = elapsedtime;

//     //Base setup
//     renderer.render(scene, camera);
    
//     if(mixer){
//         mixer.update(deltaTime)
//     }
    
//     controls.update();

//     requestAnimationFrame(animation);
// }
// animation()