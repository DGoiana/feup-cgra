import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js'
import { MyQuad } from '../common/MyQuad.js'
import { Sphere } from '../common/Sphere.js'
import { MyEllipsoid } from '../common/MyEllipsoid.js'
import { MyCilinder } from '../common/MyCilinder.js'
import { MyBucket } from './MyBucket.js'
import { MyDropSystem } from '../environment/MyDrop.js'

const MAIN_ROTOR_SPEED = 4
const TAIL_ROTOR_SPEED = 10
const LEAN_STEP = 0.1;
const MAX_LEAN = 0.01;

const STATES = {
	IDLE: 0,
	CRUISING: 1,
	ASCENDING: 2,
	LANDING: 3,
	DESCENDING: 4,
	FILLING: 5,
	EXTINGUISHING: 6
}

const LANDING_PHASES = {
	NAVIGATING: 0,
	DESCENDING: 1,
	LANDED: 2,
}

/**
* MyHeli
* @constructor
 * @param {CGFscene} scene
*/
export class MyHeli extends CGFobject {
	constructor(scene, pos = [-110, 32.25, -34], startTime = 0, scale = 3) {
		super(scene)

		this.body = new MyEllipsoid(scene, 20, 20, 0.5, 0.5, 1.5)

		this.tail = new MyCilinder(scene, 10, 10, 0.05, 0.5)
		this.tailRotorHub = new Sphere(scene, 10, 10, 0.15)
		this.tailRotorBlade = new MyQuad(scene)

		this.mainRotorHub = new Sphere(scene, 10, 10, 0.15)
		this.mainRotorBlade = new MyQuad(scene)

		this.cockpit = new Sphere(scene, 20, 20, 0.5)

		this.verticalLandingTube = new MyCilinder(scene, 10, 10, 0.01, 0.5)
		this.horizontalLandingTube = new MyCilinder(scene, 10, 10, 0.02, 1.4)

		this.bucket = new MyBucket(scene, 0.2, 0.3, true, false)
		this.water = new MyBucket(scene, 0.15, 0.2, true, true)
		this.rope = new MyCilinder(scene, 5, 5, 0.01, 1)

		this.waterDropSystem = new MyDropSystem(scene)

		this.mainRotorAngle = 0
		this.tailRotorAngle = 0

		this.position = {
			x: pos[0],
			y: pos[1],
			z: pos[2]
		}

    this.scale = scale;

		this.state = STATES.IDLE

		this.velocity = {
			x: 0,
			y: 0,
			z: 0
		}

		this.orientation = 0

		this.startTime = startTime
		this.lastFrame = null

		this.bucketPosition = {
			x: 0,
			y: -.25,
			z: 0
		}

		this.waterPosition = {
			x: 0,
			y: 0,
			z: 0
		}

		this.showingRope = false
		this.bucketFilled = false

		this.landingPhase = null
		
		this.leanAngle = 0;

		this.lastHeliportTexture = null
	}

	initMaterials(_) {

		this.bodyMaterial = new CGFappearance(this.scene)
		this.bodyMaterial.setAmbient(0.2, 0.2, 0.2, 1.0)
		this.bodyMaterial.setDiffuse(0.7, 0.7, 0.7, 1.0)
		this.bodyMaterial.setSpecular(0.5, 0.5, 0.5, 1.0)
		this.bodyMaterial.setShininess(50)

		this.cockpitMaterial = new CGFappearance(this.scene)
		this.cockpitMaterial.setAmbient(0.1, 0.1, 0.1, 1.0)
		this.cockpitMaterial.setDiffuse(0.1, 0.3, 0.5, 0.8)
		this.cockpitMaterial.setSpecular(0.6, 0.6, 0.6, 1.0)
		this.cockpitMaterial.setShininess(100)

		this.rotorMaterial = new CGFappearance(this.scene)
		this.rotorMaterial.setAmbient(0.1, 0.1, 0.1, 1.0)
		this.rotorMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0)
		this.rotorMaterial.setSpecular(0.8, 0.8, 0.8, 1.0)
		this.rotorMaterial.setShininess(80)

		this.tailMaterial = new CGFappearance(this.scene)
		this.tailMaterial.setAmbient(0.2, 0.2, 0.2, 1.0)
		this.tailMaterial.setDiffuse(0.6, 0.6, 0.6, 1.0)
		this.tailMaterial.setSpecular(0.3, 0.3, 0.3, 1.0)
		this.tailMaterial.setShininess(30)

		this.waterMaterial = new CGFappearance(this.scene)
		this.waterMaterial.setAmbient(0.05, 0.05, 0.9, 1.0)
		this.waterMaterial.setDiffuse(0.05, 0.05, 0.9, 1.0)
		this.waterMaterial.setSpecular(0.05, 0.05, 0.9, 1.0)
		this.waterMaterial.setShininess(30)
	}

	isOverLake(x, z) {
    const lakeCenter = { x: -100, z: 65 };
    const lakeRadius = 40;
    
    const dx = x - lakeCenter.x;
    const dz = z - lakeCenter.z;
    
    const distance = Math.hypot(dx, dz);
    
    return distance <= lakeRadius;
  }

	updateHeliportTexture(texturePath) {
		if (this.lastHeliportTexture !== texturePath) {
			this.scene.building.topFloor.heliport.updateTexture(this.scene.textureManager, texturePath)
			this.lastHeliportTexture = texturePath
		}
	}

	turn(v) {
		this.orientation += v;

		const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

		if (speed > 0) {
			this.velocity.x = Math.sin(this.orientation) * speed;
			this.velocity.z = Math.cos(this.orientation) * speed;
		}
	}

	accelerate(v) {
		const currentSpeed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z);

		const newSpeed = Math.max(0, currentSpeed + v);

		if (currentSpeed > 0) {
			const ratio = newSpeed / currentSpeed;
			this.velocity.x *= ratio;
			this.velocity.z *= ratio;
		} else {
			this.velocity.x = Math.sin(this.orientation) * newSpeed;
			this.velocity.z = Math.cos(this.orientation) * newSpeed;
		}

		if (v > MAX_LEAN) {
				this.leanAngle = -LEAN_STEP;
		} else if (v < -MAX_LEAN) { 
				this.leanAngle = LEAN_STEP;
		}
	}

	rest() {
		const height = this.scene.building ? this.scene.building.getHeight() : 32.25;
		
		this.position = {x: -110, y: height, z: -34}
		this.bucketPosition = {x: 0, y: -.25, z: 0}
		this.velocity = {x: 0, y: 0, z: 0}
		this.orientation = 0
		this.state = STATES.IDLE
		this.landingPhase = null
		this.bucketFilled = false
		this.showingRope = false
		this.leanAngle = 0;
		this.waterDropSystem.clearAllDrops()
		this.updateHeliportTexture("images/heliport.jpg")
	}

	toggleCruise(speedFactor) {
		if(this.state == STATES.ASCENDING) {
			this.velocity.y = 0
			this.state = STATES.CRUISING
			this.updateHeliportTexture("images/heliport.jpg")
		} else {
			this.velocity.y = 2 * speedFactor;
			this.state = STATES.ASCENDING
			this.updateHeliportTexture("images/up_heli.png")
		}
	}

	getWater(speedFactor) {
		this.state = STATES.DESCENDING
		this.velocity.y = -5 * speedFactor;
	}

	startLanding() {
		if(this.state == STATES.IDLE) return

		this.state = STATES.LANDING
		this.landingPhase = LANDING_PHASES.NAVIGATING
	}

	handleLandingLogic(delta_t, speedFactor) {
		if (this.landingPhase === LANDING_PHASES.NAVIGATING) {
			this.handleNavigation(delta_t, speedFactor)
		} else if (this.landingPhase === LANDING_PHASES.DESCENDING) {
			this.updateHeliportTexture("images/down_heli.png")
			this.handleDescent(speedFactor)
		}
	}

	handleNavigation(delta_t, speedFactor) {
		const dx = -110 - this.position.x
		const dz = -34 - this.position.z
		const dy = (this.scene.building.getHeight() + 15) - this.position.y

    const horizontalDistance = Math.hypot(dx, dz);

		if (Math.abs(dy) > 1.0) {
			this.velocity = {x: 0, y: 2 * speedFactor, z: 0}
		}
		else if (horizontalDistance > 1.0) {
			const targetAngle = Math.atan2(dx, dz)
			const angleDiff = targetAngle - this.orientation

			let normalizedAngleDiff = ((angleDiff + Math.PI) % (2 * Math.PI)) - Math.PI

			if (Math.abs(normalizedAngleDiff) > 0.1) {
				this.accelerate(-0.1 * speedFactor)
				this.turn(Math.sign(normalizedAngleDiff) * 0.05 * delta_t * 60 * speedFactor)
			} else {
				this.accelerate(0.05 * speedFactor)
			}
		}
		else {
			let normalizedOrientation = ((this.orientation + Math.PI) % (2 * Math.PI)) - Math.PI

			if (Math.abs(normalizedOrientation) > 0.1) {
				this.velocity = {x: 0, y: 0, z: 0}
				this.turn(-Math.sign(normalizedOrientation) * 0.05 * delta_t * 60 * speedFactor)
			} else {
				this.landingPhase = LANDING_PHASES.DESCENDING
				this.velocity = {x: 0, y: -2 * speedFactor, z: 0}
				this.orientation = 0
			}
		}
	}

	handleDescent(speedFactor) {
		const height = this.scene.building ? this.scene.building.getHeight() : 32.25;

		if (this.velocity.y === 0 || this.velocity.y > -0.01) {
			this.velocity.y = -2 * speedFactor;
		}

		if (this.position.y <= height + 0.5) {
			this.rest()
			this.landingPhase = LANDING_PHASES.LANDED
		}
	}

	clearFire() {
		this.state = STATES.EXTINGUISHING
		this.waterDropSystem.startDropping(this.position, this.velocity)
	}

	checkKeys(speedFactor) {
		if (this.scene.gui.isKeyPressed("KeyW")) {
			this.accelerate(0.3 * speedFactor);
		}

		if (this.scene.gui.isKeyPressed("KeyS")) {
			this.accelerate(-0.3 * speedFactor);
		}

		if (this.scene.gui.isKeyPressed("KeyA")) {
			this.turn(0.3 * speedFactor);
		}

		if (this.scene.gui.isKeyPressed("KeyD")) {
			this.turn(-0.3 * speedFactor);
		}

		if (this.scene.gui.isKeyPressed("KeyR")) {
			this.rest();
		}

		if (this.scene.gui.isKeyPressed("KeyP")) {
			this.toggleCruise(speedFactor)
		}

		if (this.scene.gui.isKeyPressed("KeyO") && this.bucketFilled && this.scene.forest.isOverForest(this.position.x, this.position.z)) {
			this.clearFire()
		}

		if (this.scene.gui.isKeyPressed("KeyL") && this.state != STATES.LANDING && this.state != STATES.DESCENDING) {
			if(this.isOverLake(this.position.x, this.position.z) && !this.bucketFilled) {
				this.getWater(speedFactor)
			} else {
				this.startLanding()
			}
		}
	}

	update(appStartTime, speedFactor) {
		let currentTime = appStartTime;
		let delta_t = 0;

		if (this.lastFrame) {
			delta_t = currentTime - this.lastFrame;
		}
		this.lastFrame = currentTime;

		this.checkKeys(speedFactor);

		this.leanAngle *= 0.95;
		if (Math.abs(this.leanAngle) < 0.001) {
				this.leanAngle = 0;
		}

		switch(this.state) {
			case STATES.ASCENDING:
				if (this.position.y >= (this.scene.building.getHeight() + 15)) {
					this.toggleCruise(speedFactor)
				}

				if (this.position.y >= this.scene.building.getHeight() + 10 && this.position.y < this.scene.building.getHeight() + 11 && !this.bucketFilled) {
					this.showingRope = true
					this.bucketPosition.y -= 0.1 * speedFactor
				}
				break
			case STATES.LANDING:
				this.handleLandingLogic(delta_t, speedFactor)

				if (this.position.y <= this.scene.building.getHeight() + 11 && this.position.y >= this.scene.building.getHeight() + 10) {
					this.bucketPosition.y += 0.1 * speedFactor
				}

				if (this.position.y <= this.scene.building.getHeight() + 10) {
					this.showingRope = false
				}
				break
			case STATES.DESCENDING:
				if (this.position.y <= 2.5) {
					this.bucketFilled = true
					this.state = STATES.IDLE
				}
				break
			case STATES.EXTINGUISHING:
				if (this.waterDropSystem.getActiveDropCount() === 0 && !this.waterDropSystem.isDropping) {
					this.bucketFilled = false
					this.state = STATES.CRUISING
				}

				if (this.waterDropSystem.isDropping) {
					if (!this.dropStartTime) {
						this.dropStartTime = currentTime
					} else if (currentTime - this.dropStartTime > 2.0) {
						this.waterDropSystem.stopDropping()
						this.dropStartTime = null
					}
				}
				break
			case STATES.IDLE:
				this.velocity = {x: 0, y: 0, z: 0}
				break
		}

		if(this.state != STATES.IDLE) {
			this.mainRotorAngle += MAIN_ROTOR_SPEED * delta_t;
			this.tailRotorAngle += TAIL_ROTOR_SPEED * delta_t;
		}

		this.waterDropSystem.update(delta_t, currentTime, this.position, this.velocity)

		if (this.scene.forest && this.waterDropSystem.getActiveDropCount() > 0) {
			this.waterDropSystem.checkFireCollisions(this.scene.forest)
		}

		this.position.x += this.velocity.x * delta_t;
		this.position.y += this.velocity.y * delta_t;
		this.position.z += this.velocity.z * delta_t;

		// console.log(this.scene.forest.isOverForest(this.position.x, this.position.z));
	}

	drawMainRotor() {
		this.rotorMaterial.apply()

		this.scene.pushMatrix()
			this.scene.translate(0, 0.4, 0)
			this.mainRotorHub.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()

			this.scene.translate(0, 0.5, 0)
			this.scene.rotate(this.mainRotorAngle, 0, 1, 0)

			this.scene.pushMatrix()
				this.scene.scale(3, 0.05, 0.2)
				this.mainRotorBlade.display()
			this.scene.popMatrix()

			this.scene.pushMatrix()
				this.scene.rotate(Math.PI/2, 0, 1, 0)
				this.scene.scale(3, 0.05, 0.2)
				this.mainRotorBlade.display()
			this.scene.popMatrix()

		this.scene.popMatrix()
	}

	drawTailRotor() {
		this.rotorMaterial.apply()

		this.scene.pushMatrix()
			this.scene.translate(0, 0, -2)
			this.tailRotorHub.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(0.15, 0, -2)
			this.scene.rotate(this.tailRotorAngle, 1, 0, 0)

			this.scene.pushMatrix()
				this.scene.rotate(Math.PI / 2, 0, 0, 1)
				this.scene.scale(0.5, 0.05, 0.1)
				this.tailRotorBlade.display()
			this.scene.popMatrix()

		this.scene.popMatrix()
	}

	drawTail() {
		this.tailMaterial.apply()

		this.scene.pushMatrix()
			this.scene.translate(0, 0, -1.85)
			this.tail.display()
		this.scene.popMatrix()

		this.drawTailRotor()
	}

	drawLandingGear() {
		this.bodyMaterial.apply()

		this.scene.pushMatrix()
			this.scene.translate(.25, -.3, .3)
			this.scene.rotate(Math.PI / 3, 1, 0, 0)
			this.scene.rotate(Math.PI / 8, 0, 1, 0)
			this.verticalLandingTube.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(-.25, -.3, .3)
			this.scene.rotate(Math.PI / 3, 1, 0, 0)
			this.scene.rotate(-Math.PI / 8, 0, 1, 0)
			this.verticalLandingTube.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(.25, -.3, -.4)
			this.scene.rotate(Math.PI / 1.5, 1, 0, 0)
			this.scene.rotate(Math.PI / 8, 0, 1, 0)
			this.verticalLandingTube.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(-.25, -.3, -.4)
			this.scene.rotate(Math.PI / 1.5, 1, 0, 0)
			this.scene.rotate(-Math.PI / 8, 0, 1, 0)
			this.verticalLandingTube.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(-.45, -.7, -.75)
			this.horizontalLandingTube.display()
		this.scene.popMatrix()

		this.scene.pushMatrix()
			this.scene.translate(.45, -.7, -.75)
			this.horizontalLandingTube.display()
		this.scene.popMatrix()
	}

	display() {
		this.scene.pushMatrix()

			this.scene.translate(this.position.x, this.position.y, this.position.z)
      this.scene.scale(this.scale, this.scale, this.scale)

			this.scene.pushMatrix()
				this.scene.translate(this.bucketPosition.x, this.bucketPosition.y, this.bucketPosition.z)
				this.scene.rotate(Math.PI / 2, 1, 0, 0)
				this.scene.rotate(Math.PI, 1, 0, 0)
				this.bucket.display()
				if(this.showingRope) this.rope.display()

				if(this.bucketFilled){
					this.waterMaterial.apply()
					this.scene.translate(this.waterPosition.x, this.waterPosition.y, this.waterPosition.z)
					this.water.display()
				}
			this.scene.popMatrix()

			this.scene.rotate(this.orientation, 0, 1, 0)
			this.scene.rotate(this.leanAngle, 1, 0, 0);

			this.bodyMaterial.apply()
			this.scene.pushMatrix()
				this.scene.scale(1, 0.8, 1)
				this.body.display()
			this.scene.popMatrix()

			this.cockpitMaterial.apply()
			this.scene.pushMatrix()
				this.scene.translate(0, 0.2, 0.8)
				this.scene.scale(1, 0.5, 0.5)
				this.cockpit.display()
			this.scene.popMatrix()

			this.drawMainRotor()
			this.drawTail()
			this.drawLandingGear()

		this.scene.popMatrix()

		this.waterDropSystem.display()
	}
}
