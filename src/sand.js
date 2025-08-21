import * as THREE from "three";

export default function sand(scene) {
  const sandGeometry = new THREE.BufferGeometry();
  const sandCount = 5000;

  const positions = new Float32Array(sandCount * 3);

  for (let i = 0; i < sandCount; i++) {
    const x = (Math.random() - 0.5) * 9.5;
    const y = 0; // slight vertical variation
    const z = (Math.random() - 0.5) * 6.8;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  sandGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const sandMaterial = new THREE.PointsMaterial({
    size: 0.09,
    color: 0xd2b48c, // sand color
    transparent: true,
    opacity: 0.9,
  });

  const sand = new THREE.Points(sandGeometry, sandMaterial);
  sand.position.y = 0.35;
  scene.add(sand);
  return sand;
}
