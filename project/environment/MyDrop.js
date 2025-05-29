import { CGFobject, CGFappearance } from '../../lib/CGF.js'
import { Sphere } from '../common/Sphere.js'

const GRAVITY = -9.8

/**
 * MyDrop defines a single drop
 */
export class MyDrop extends CGFobject {
    constructor(scene, size = 0.1, position = {x: 0, y: 0, z: 0}, velocity = {x: 0, y: -2, z: 0}) {
        super(scene)

        this.size = size
        this.position = { ...position }
        this.velocity = { ...velocity }

        this.sphereBody = new Sphere(scene, 10, 10, 1.0)
        this.active = true

        this.initMaterials()
    }

    initMaterials() {
        this.waterMaterial = new CGFappearance(this.scene)
        this.waterMaterial.setAmbient(0.1, 0.3, 0.8, 0.8)
        this.waterMaterial.setDiffuse(0.2, 0.5, 0.9, 0.8)
        this.waterMaterial.setSpecular(0.8, 0.8, 1.0, 0.8)
        this.waterMaterial.setShininess(100)
    }

    /**
     * Updates the drop position according to gravity.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @returns 
     */
    update(deltaTime) {
        if (!this.active) return

        this.velocity.y += GRAVITY * deltaTime

        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime
        this.position.z += this.velocity.z * deltaTime

        if (this.position.y <= 0.1) {
            this.active = false
        }
    }

    /**
     * Checks if the drop has collided with a fire instance.
     * @param {array} firePosition - fire x and z positions in the scene.
     * @returns 
     */
    checkCollisionWithFire(firePosition) {
        if (!this.active) return false

        const fireX = firePosition[0]
        const fireZ = firePosition[2]

        const dx = this.position.x - fireX
        const dz = this.position.z - fireZ
        const distance = Math.hypot(dx, dz)

        return distance < 10.0 && this.position.y < 3.0
    }

    /**
     * Determines if drop is active or not.
     * @returns if drop has not already collided with fire.
     */
    isActive() {
        return this.active
    }

    /**
     * Returns the current drop position.
     * @returns drop position.
     */
    getPosition() {
        return this.position
    }

    /**
     * Displays the drop in the scene.
     * @returns 
     */
    display() {
        if (!this.active) return

        this.waterMaterial.apply()

        this.scene.pushMatrix()

          this.scene.translate(this.position.x, this.position.y, this.position.z)

          this.scene.scale(this.size, this.size, this.size)

          this.scene.pushMatrix()
            this.scene.scale(0.8, 1.0, 0.8)
            this.sphereBody.display()
          this.scene.popMatrix()

        this.scene.popMatrix()
    }
}

/**
 * MyDropSystem defines the whole animation and behaviour of group of drops that extinguishes the fire.
 */
export class MyDropSystem extends CGFobject {
    constructor(scene) {
        super(scene)

        this.drops = []
        this.isDropping = false
        this.dropInterval = 0.1
        this.lastDropTime = 0
    }

    /**
     * Sets up variables to start dropping drops of water.
     */
    startDropping(helicopterPosition, helicopterVelocity) {
        this.isDropping = true
        this.helicopterPos = { ...helicopterPosition }
        this.helicopterVel = { ...helicopterVelocity }
    }

    /**
     * Updates the drop system to start dropping water.
     */
    stopDropping() {
        this.isDropping = false
    }

    /**
     * Creates drops for a drop interval and then after it, just updates the drops to fall.
     * @param {number} deltaTime            - time elapsed in milliseconds.
     * @param {number} currentTime          - current time.
     * @param {array} helicopterPosition    - helicopter position (X,Z).
     * @param {array} helicopterVelocity    - helicopter velocity
     */
    update(deltaTime, currentTime, helicopterPosition, helicopterVelocity) {
        if (this.isDropping && currentTime - this.lastDropTime >= this.dropInterval) {
            this.createDrop(helicopterPosition, helicopterVelocity)
            this.lastDropTime = currentTime
        }

        for (let i = this.drops.length - 1; i >= 0; i--) {
            this.drops[i].update(deltaTime)

            if (!this.drops[i].isActive()) {
                this.drops.splice(i, 1)
            }
        }
    }

    /**
     * Creates a new drop according to the helicopter position and velocity
     * @param {array} helicopterPosition    - helicopter position (X,Z)
     * @param {array} helicopterVelocity    - helicopter velocity
     */
    createDrop(helicopterPosition, helicopterVelocity) {
        const spreadX = (Math.random() - 0.5) * 2.0
        const spreadZ = (Math.random() - 0.5) * 2.0

        const position = {
            x: helicopterPosition.x + spreadX,
            y: helicopterPosition.y - 2.0,
            z: helicopterPosition.z + spreadZ
        }

        const velocity = {
            x: helicopterVelocity.x * 0.3 + (Math.random() - 0.5) * 0.5,
            y: -1.0,
            z: helicopterVelocity.z * 0.3 + (Math.random() - 0.5) * 0.5
        }

        const size = 0.08 + Math.random() * 0.04

        const drop = new MyDrop(this.scene, size, position, velocity)
        this.drops.push(drop)
    }

    /**
     * Checks drops collision and extinguishes fires for a whole forest instance
     * @param {MyForest} forest 
     * @returns if has fires that were extinguised
     */
    checkFireCollisions(forest) {
        const extinguishedFires = []

        for (let drop of this.drops) {
            if (!drop.isActive()) continue

            for (let i = 0; i < forest.fires.length; i++) {
                const fire = forest.fires[i]
                if (drop.checkCollisionWithFire([fire[1], 0, fire[2]])) {
                    extinguishedFires.push(i)
                    drop.active = false
                    break
                }
            }
        }

        for (let i = extinguishedFires.length - 1; i >= 0; i--) {
            forest.fires.splice(extinguishedFires[i], 1)
        }

        return extinguishedFires.length > 0
    }

    /**
     * Determines the number of active drops
     * @returns the number of active drops
     */
    getActiveDropCount() {
        return this.drops.filter(drop => drop.isActive()).length
    }

    /**
     * Removes all drops from the system and stops dropping
     */
    clearAllDrops() {
        this.drops = []
        this.isDropping = false
    }

    /**
     * Displays the system in the scene
     */
    display() {
        for (let drop of this.drops) {
          drop.display()
        }
    }
}
