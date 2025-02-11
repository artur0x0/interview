import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, renderer, camera;
let model, skeleton;

init();

function init() {
    const container = document.getElementById('container');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(3, 10, 10);
    scene.add(dirLight);

    // Ground
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Axes
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // Load character
    const loader = new GLTFLoader();
    const modelUrl = 'https://threejs.org/examples/models/gltf/Xbot.glb';
    
    loader.load(modelUrl,
        function (gltf) {
            model = gltf.scene;
            scene.add(model);

            // Skeleton helper
            skeleton = new THREE.SkeletonHelper(model);
            skeleton.visible = true;
            scene.add(skeleton);
        }
    );

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(-1, 2, 3);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.target.set(0, 1, 0);
    controls.update();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    renderer.setAnimationLoop(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.render(scene, camera);
}

// TO-DO: Create a function to point one of the arms at a specific X, Y coordinate in space

// Helper function to test solution
window.testArmPositions = function() {
    // Test a few different positions
    const positions = [
        { x: -1, y: 1.5, z: 0 }, // Left
        { x: -1, y: 2, z: 0 },
        { x: 0, y: 2.5, z: 0 }, // Up
        { x: 1, y: 2, z: 0 }
    ];

    let index = 0;
    const interval = setInterval(() => {
        if (index >= positions.length) {
            clearInterval(interval);
            return;
        }

        // The sphere tells you if the arm is pointing the right way
        if (window.debugSphere) {
            scene.remove(window.debugSphere);
            window.debugSphere.geometry.dispose();
            window.debugSphere.material.dispose();
        }

        const pos = positions[index];
        
        window.debugSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        debugSphere.position.set(pos.x, pos.y, pos.z);
        scene.add(window.debugSphere);
        
        // TO-DO: Call function here

        index++;
    }, 1000);
};