import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { Sphere } from "../common/Sphere.js";

export class MyLight extends CGFobject {
  constructor(scene) {
    super(scene)

    this.body = new Sphere(scene, 10, 10, 0.01)
  
    this.time = 0;
    this.baseIntensity = 2;
    this.flickerSpeed = 5.0;

    this.initMaterials()
  }

  initMaterials() {
    this.lightMaterial = new CGFappearance(this.scene);
    this.lightMaterial.setAmbient(1, .2, .2, 1);
    this.lightMaterial.setDiffuse(1, .2, .2, 1);
    this.lightMaterial.setSpecular(1, .2, .2, 1);
    this.lightMaterial.setShininess(10.0);
  }

  update(t) {
    this.time = t;
  }

  display() {
    const flicker = Math.sin(this.time * this.flickerSpeed);
    const intensity = this.baseIntensity + flicker;
  
    this.lightMaterial.setEmission(intensity, intensity * 0.2, intensity * 0.2, 1.0);
    
    this.lightMaterial.apply();
    this.body.display();
  }
}
