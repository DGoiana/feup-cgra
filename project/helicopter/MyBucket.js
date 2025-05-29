import { CGFobject, CGFappearance, CGFtexture } from '../../lib/CGF.js'
import { MyCilinder } from '../common/MyCilinder.js'

export class MyBucket extends CGFobject {
	constructor(scene, radius, height, baseBottom, baseTop) {
		super(scene)

		this.body = new MyCilinder(scene, 10, 10, radius, height, baseBottom, baseTop)
	}

	/**
	 * Displays the bucket in the scene
	 */
	display() {
		this.body.display()
	}
}