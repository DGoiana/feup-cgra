import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js'
import { MyCilinder } from '../common/MyCilinder.js'

export class MyBucket extends CGFobject {
	constructor(scene) {
		super(scene)

		this.body = new MyCilinder(scene, 10, 10, 0.2, 0.3, true)
	}

	display() {
		this.body.display()
	}
}