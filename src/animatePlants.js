import gsap from "gsap";

export default function animatePlants(model) {
  const plants = [];

  // Find all swiggly plants in the model
  model.traverse((plant) => {
    if (plant.isMesh && plant.name.startsWith("swiggly-plants")) {
      plants.push(plant);
    }
  });

  // Simple animation using GSAP rotation
  plants.forEach((plant, index) => {
    gsap.to(plant.rotation, {
      x: 0.1 * Math.random(), // rotate slightly
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.2 * Math.random(), // small delay for natural movement
    });
    gsap.to(plant.rotation, {
      z: 0.1 * Math.random(), // rotate slightly
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.2 * Math.random(), // small delay for natural movement
    });
  });

  const mushroomPlants = [];

  // Find all mushroom plants in the model
  model.traverse((plant) => {
    if (plant.isMesh && plant.name.startsWith("mushroom-swiggle")) {
      mushroomPlants.push(plant);
    }
  });

  // Simple animation using GSAP rotation
  mushroomPlants.forEach((plant, index) => {
    gsap.to(plant.rotation, {
      x: 0.1 * Math.random(), // rotate slightly
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.2 * Math.random(), // small delay for natural movement
    });
    gsap.to(plant.rotation, {
      z: 0.1 * Math.random(), // rotate slightly
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.2 * Math.random(), // small delay for natural movement
    });
  });
}
