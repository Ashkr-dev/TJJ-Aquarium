import * as THREE from "three";
import gsap from "gsap";

export default class FishControls {
  constructor(fish, aquariumBox) {
    this.fish = fish;
    this.aquariumBox = aquariumBox;

    // Movement parameters
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.moveSpeed = 0.03;
    this.turnSpeed = 0.02;

    // Rotation angles
    this.targetAngle = 0;
    this.currentAngle = 0;

    // Keyboard control state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    // Automatic random swimming
    this.randomTarget = new THREE.Vector3();
    this.isUserControlling = false;

    this._initListeners();
    this._setRandomDestination();
  }

  /** Set a random target inside the aquarium */
  _setRandomDestination() {
    this.randomTarget.set(
      THREE.MathUtils.randFloat(this.aquariumBox.min.x, this.aquariumBox.max.x),
      THREE.MathUtils.randFloat(this.aquariumBox.min.y, this.aquariumBox.max.y),
      THREE.MathUtils.randFloat(this.aquariumBox.min.z, this.aquariumBox.max.z)
    );
  }

  /** Keyboard listeners */
  _initListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp") this.keys.forward = true;
      if (e.code === "ArrowDown") this.keys.backward = true;
      if (e.code === "ArrowLeft") this.keys.left = true;
      if (e.code === "ArrowRight") this.keys.right = true;

      // User starts controlling
      this.isUserControlling = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp") this.keys.forward = false;
      if (e.code === "ArrowDown") this.keys.backward = false;
      if (e.code === "ArrowLeft") this.keys.left = false;
      if (e.code === "ArrowRight") this.keys.right = false;

      // If all keys are released → back to random swim
      if (
        !this.keys.forward &&
        !this.keys.backward &&
        !this.keys.left &&
        !this.keys.right
      ) {
        this.isUserControlling = false;
        this._setRandomDestination();
      }
    });
  }

  /** Keep fish inside the aquarium */
  _keepInsideAquarium() {
    const pos = this.fish.position;
    pos.x = THREE.MathUtils.clamp(pos.x, this.aquariumBox.min.x, this.aquariumBox.max.x);
    pos.y = THREE.MathUtils.clamp(pos.y, this.aquariumBox.min.y, this.aquariumBox.max.y);
    pos.z = THREE.MathUtils.clamp(pos.z, this.aquariumBox.min.z, this.aquariumBox.max.z);
  }

  /** Update function called in animation loop */
  update() {
    if (this.isUserControlling) {
      this._updateUserControl();
    } else {
      this._updateRandomSwim();
    }

    this._keepInsideAquarium();
  }

  /** Handle manual movement */
  _updateUserControl() {
    let move = 0;
    if (this.keys.forward) move = 1;
    if (this.keys.backward) move = -1;

    if (this.keys.left) this.targetAngle += this.turnSpeed;
    if (this.keys.right) this.targetAngle -= this.turnSpeed;

    // Smooth rotation
    let diff = this.targetAngle - this.currentAngle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.currentAngle += diff * 0.1;

    // Move forward/backward
    const dir = new THREE.Vector3(
      Math.sin(this.currentAngle),
      0,
      Math.cos(this.currentAngle)
    );
    this.velocity.copy(dir).multiplyScalar(move * this.moveSpeed);
    this.fish.position.add(this.velocity);
    this.fish.rotation.y = this.currentAngle;
  }

  /** Handle automatic random swimming */
  _updateRandomSwim() {
    const dir = this.randomTarget.clone().sub(this.fish.position);
    const distance = dir.length();

    // If close to target → choose a new random target
    if (distance < 0.1) {
      this._setRandomDestination();
      return;
    }

    dir.normalize();
    this.velocity.copy(dir).multiplyScalar(0.02); // Slow natural movement
    this.fish.position.add(this.velocity);

    // Calculate smooth rotation toward target
    this.targetAngle = Math.atan2(dir.x, dir.z);
    let diff = this.targetAngle - this.currentAngle;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    this.currentAngle += diff * 0.05;

    this.fish.rotation.y = this.currentAngle;
  }
}
