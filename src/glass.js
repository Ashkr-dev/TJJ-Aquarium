import * as THREE from "three";
import glassVertexShader from "./shaders/glass/vertex.glsl";
import glassFragmentShader from "./shaders/glass/fragment.glsl";

export default function glassMaterial(gui, environmentMap) {
  // Parameters
  const glassParameters = {};
  glassParameters.color = "#244594";

  // Glass Material
  const glassMaterial = new THREE.ShaderMaterial({
    vertexShader: glassVertexShader,
    fragmentShader: glassFragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uColor: new THREE.Uniform(new THREE.Color(glassParameters.color)),
      uRefractPower: new THREE.Uniform(0.11),
      uOpacity: new THREE.Uniform(0.12),
      uEnvMap: new THREE.Uniform(environmentMap),
    },
    transparent: true,
    side: THREE.DoubleSide,
  });

  const guiGlass = gui.addFolder("Glass");
  guiGlass
    .addColor(glassParameters, "color")
    .name("Glass Color")
    .onChange(() => {
      glassMaterial.uniforms.uColor.value.set(glassParameters.color);
    });
  guiGlass
    .add(glassMaterial.uniforms.uRefractPower, "value")
    .min(0)
    .max(10)
    .step(0.01)
    .name("Refract Power");
  guiGlass
    .add(glassMaterial.uniforms.uOpacity, "value")
    .min(0)
    .max(1)
    .step(0.01)
    .name("Opacity");

  return glassMaterial;
}
