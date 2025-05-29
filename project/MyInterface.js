import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor');

        this.gui.add(this.scene, 'cameraMode', ['Free View', 'Helicopter View']).name('Camera Mode');        
        
        this.gui.add(this.scene, 'fireAnimation', false).name('Fire Animation');

        this.gui.add(this.scene, 'forestRows', 5, 45).step(1).name('Forest Rows');
        this.gui.add(this.scene, 'forestCols', 5, 45).step(1).name('Forest Columns');
        this.gui.add(this.scene, 'treesOffset', 5, 15).name('Trees Spacing');

        this.gui.add(this.scene, 'buildingFloors', 1, 10).step(1).name('Building Floors');
        this.gui.add(this.scene, 'buildingWindows', 1, 8).step(1).name('Building Windows');

        this.gui.addColor(this.scene, 'helicopterColor').name('Helicopter Color').onChange(() => {
            this.scene.updateHelicopterColor();
        });
        this.gui.addColor(this.scene, 'buildingColor').name('Building Color').onChange(() => {
            this.scene.updateBuildingColor();
        });

        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}