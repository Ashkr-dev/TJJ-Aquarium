import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import glassMaterial from "./glass.js";
import waterMaterial from "./water.js";
import FishControls from "./fishControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import animatePlants from "./animatePlants.js";
import sand from "./sand.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

// Environment Map
const environmentMap = rgbeLoader.load(
  "./environmentMap2.hdr",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    // scene.background = environmentMap;
    scene.environment = environmentMap;
  }
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 8;
camera.position.y = 10;
camera.position.z = 12;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3;
controls.enableDamping = true;

/**
 * Renderer
 */
const debugObject = {};

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
debugObject.clearColor = "#160326";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});

/**
 * Material
 */
const bakedTexture = textureLoader.load("./Baked3.png");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
});

// Shaders
const glass = glassMaterial(gui, environmentMap);
const water = waterMaterial(gui);

/**
 * Model
 */
let fish;
let glassMesh;
let fishControls;
let mixer;
gltfLoader.load("./aquarium.glb", (gltf) => {
  // gltf.scene.getObjectByName('baked').material.map.anisotropy = 8
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = bakedMaterial;
    }
  }),
    scene.add(gltf.scene);

  // Aquarium Glass
  glassMesh = gltf.scene.getObjectByName("glass");
  if (glassMaterial) {
    glassMesh.material = glass;
  }

  // Aquarium Water
  const waterMesh = gltf.scene.getObjectByName("water");
  if (waterMaterial) {
    waterMesh.material = water;
  }

  // Swiggly Plants
  animatePlants(gltf.scene);

  // Fish Animation
  fish = gltf.scene.getObjectByName("fish-rig");
  // fishControls = new FishControls(fish);

  mixer = new THREE.AnimationMixer(fish);
  const action = mixer.clipAction(gltf.animations[0]);
  action.play();

  const aquariumBox = new THREE.Box3().setFromObject(glassMesh);
  // Create fish controls
  fishControls = new FishControls(fish, aquariumBox);
});

sand(scene);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update Materials
  glass.uniforms.uTime.value = elapsedTime;
  water.uniforms.uTime.value = elapsedTime;

  // Update mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update Fish Controls
  if (fish) {
    fishControls.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
