import * as THREE from "three";
import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

export default function waterMaterial(gui) {
  /**
   * Water Material
   */
  const materialParameters = {};
  materialParameters.color = "#3a87d9";
  materialParameters.baseColor = "#3a87d9";
  materialParameters.fresnelGlow = "#5437e1";
  materialParameters.depthColor = "#6884f3";
  materialParameters.surfaceColor = "#0f3967";

  const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uBaseColor: new THREE.Uniform(
        new THREE.Color(materialParameters.baseColor)
      ),
      uFresnelGlow: new THREE.Uniform(
        new THREE.Color(materialParameters.fresnelGlow)
      ),
      uBigWavesElevation: new THREE.Uniform(0.1),
      uBigWavesFrequency: new THREE.Uniform(new THREE.Vector2(2.17, 1.05)),
      uBigWavesSpeed: new THREE.Uniform(0.679),

      uDepthColor: new THREE.Uniform(
        new THREE.Color(materialParameters.depthColor)
      ),
      uSurfaceColor: new THREE.Uniform(
        new THREE.Color(materialParameters.surfaceColor)
      ),
      uColorOffset: new THREE.Uniform(0.25),
      uColorMultiplier: new THREE.Uniform(2.0),
      uPerlinTexture: new THREE.Uniform(
        new THREE.TextureLoader().load("/perlin.png")
      ),
    },
    // wireframe: true,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const guiWater = gui.addFolder("Water");
  guiWater.addColor(waterMaterial.uniforms.uBaseColor, "value").name("Color");
  guiWater
    .addColor(waterMaterial.uniforms.uFresnelGlow, "value")
    .name("FresnelGlow");
  guiWater
    .add(waterMaterial.uniforms.uBigWavesElevation, "value")
    .min(0)
    .max(5)
    .step(0.01)
    .name("Big Waves Elevation");

  guiWater
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
    .min(0)
    .max(50)
    .step(0.01)
    .name("Big Waves Frequency X");
  guiWater
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
    .min(0)
    .max(50)
    .step(0.01)
    .name("Big Waves Frequency Y");

  guiWater
    .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
    .min(0)
    .max(5)
    .step(0.01)
    .name("Big Waves Speed");

  guiWater
    .addColor(waterMaterial.uniforms.uDepthColor, "value")
    .name("Depth Color");
  guiWater
    .addColor(waterMaterial.uniforms.uSurfaceColor, "value")
    .name("Surface Color");
  guiWater
    .add(waterMaterial.uniforms.uColorOffset, "value")
    .min(0)
    .max(1)
    .step(0.01)
    .name("Color Offset");
  guiWater
    .add(waterMaterial.uniforms.uColorMultiplier, "value")
    .min(0)
    .max(2)
    .step(0.01)
    .name("Color Multiplier");

  return waterMaterial;
}
