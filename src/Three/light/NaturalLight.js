import * as THREE from 'three';

class NaturalLight {
	constructor(scene, gui,composer) {
		this.scene = scene;
		this.gui = gui;
		this.composer = composer;
	}

	setLights(intensityAmbient, intensityDirectional, helpers = false) {
		this.ambientLight = new THREE.AmbientLight(
			'#a9a6ec',
			intensityAmbient,
		);
		this.scene.add(this.ambientLight);
		this.gui.add(this.ambientLight,'intensity',0,1).name('ambientLight');

		this.directionalLight = new THREE.DirectionalLight(
			'#aad0f7',
			intensityDirectional,
		);
		this.gui.add(this.directionalLight,'intensity',0,1).name('directionalLight');

		this.scene.add(this.directionalLight);
		this.directionalLight.position.set(14, 24, -1.5);

		this.directionalLight.castShadow = true;
		this.directionalLight.shadow.mapSize.width = 4096;
		this.directionalLight.shadow.mapSize.height = 4096;
		this.directionalLight.shadow.camera.near = 1;
		this.directionalLight.shadow.camera.far = 35.5;
		this.directionalLight.shadow.camera.top = 10;
		this.directionalLight.shadow.camera.right = 10;
		this.directionalLight.shadow.camera.bottom = -10;
		this.directionalLight.shadow.camera.left = -10;
		this.directionalLight.shadow.radius = 10;

	}
}

export default NaturalLight;
