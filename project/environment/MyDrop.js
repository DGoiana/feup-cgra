import { CGFobject, CGFappearance } from '../../lib/CGF.js'
import { Sphere } from '../common/Sphere.js'
import { FOREST_CORNER } from '../forest/MyForest.js'

const GRAVITY = -9.8

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

    checkCollisionWithFire(firePosition) {
        if (!this.active) return false

        const fireX = FOREST_CORNER.x + firePosition[0]
        const fireZ = FOREST_CORNER.z + firePosition[2]

        const dx = this.position.x - fireX
        const dz = this.position.z - fireZ
        const distance = Math.hypot(dx, dz)

        return distance < 10.0 && this.position.y < 3.0
    }

    isActive() {
        return this.active
    }

    getPosition() {
        return this.position
    }

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

export class MyDropSystem extends CGFobject {
    constructor(scene) {
        super(scene)

        this.drops = []
        this.isDropping = false
        this.dropInterval = 0.1
        this.lastDropTime = 0
    }

    startDropping(helicopterPosition, helicopterVelocity) {
        this.isDropping = true
        this.helicopterPos = { ...helicopterPosition }
        this.helicopterVel = { ...helicopterVelocity }
    }

    stopDropping() {
        this.isDropping = false
    }

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

    getActiveDropCount() {
        return this.drops.filter(drop => drop.isActive()).length
    }

    clearAllDrops() {
        this.drops = []
        this.isDropping = false
    }

    display() {
        for (let drop of this.drops) {
          drop.display()
        }
    }
}
