import { CGFobject } from '../../lib/CGF.js'

export class MyEllipsoid extends CGFobject {
	constructor(scene, slices, stacks, x_radius, y_radius, z_radius) {
		super(scene);
		this.slices = slices;
		this.stacks = stacks;
		this.x_radius = x_radius;
		this.y_radius = y_radius;
		this.z_radius = z_radius;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for(let latSteps = 0; latSteps <= this.slices; latSteps++) {
			const normalized_z = latSteps / this.slices;
			const theta = normalized_z * Math.PI;
			const sin_theta = Math.sin(theta);
			const cos_theta = Math.cos(theta);

			for(let lngSteps = 0; lngSteps <= this.stacks; lngSteps++) {
				const normalized_y = lngSteps / this.stacks;
				const phi = normalized_y * Math.PI * 2;

				const sin_phi = Math.sin(phi);
				const cos_phi = Math.cos(phi);

				const x = this.x_radius * cos_phi * sin_theta;
				const y = this.y_radius * cos_theta;
				const z = -this.z_radius * sin_phi * sin_theta;
				
				this.vertices.push(x, y, z);

				const nx = (x / this.x_radius) / Math.sqrt((x / this.x_radius) ** 2 + (y / this.y_radius) ** 2 + (z / this.z_radius) ** 2);
				const ny = (y / this.y_radius) / Math.sqrt((x / this.x_radius) ** 2 + (y / this.y_radius) ** 2 + (z / this.z_radius) ** 2);
				const nz = (z / this.z_radius) / Math.sqrt((x / this.x_radius) ** 2 + (y / this.y_radius) ** 2 + (z / this.z_radius) ** 2);

				this.normals.push(nx, ny, nz);

				this.texCoords.push(normalized_y, normalized_z);
			}
		}

		for(let latSteps = 0; latSteps < this.slices; latSteps++) {
			for(let lngSteps = 0; lngSteps < this.stacks; lngSteps++) {
				const first = latSteps * (this.stacks + 1) + lngSteps;
				const second = first + this.stacks + 1;

				this.indices.push(first, second, first + 1);				
				this.indices.push(second, second + 1, first + 1);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}