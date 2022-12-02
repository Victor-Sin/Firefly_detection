import './style.css';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import NaturalLight from './Three/light/NaturalLight';
import Composer from "./Three/composer";
import { Water } from 'three/examples/jsm/objects/Water.js'


export default class MyScene{
	#sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	#camera;
	gui;
	#canvas;
	#renderer;
	#scene
	#controls;
	#composer;
	#naturalLight
	#clock;
	objects = []

	constructor() {
		// Debug
		this.gui = new dat.GUI();

		// Canvas
		this.#canvas = document.querySelector('canvas.webgl');

		// Scene
		this.#scene = new THREE.Scene();

		this.#scene.fog = new THREE.Fog('#1d1921', 1, 85)

		this.#clock = new THREE.Clock();

		this.initCamera();
		this.initRenderer();
		this.initLights();

		this.updateSize();
		this.setWater();
	}

	updateSize(){
		window.addEventListener('resize', () => {
			// Update sizes
			this.#sizes.width = window.innerWidth;
			this.#sizes.height = window.innerHeight;

			// Update camera
			this.#camera.aspect = this.#sizes.width / this.#sizes.height;
			this.#camera.updateProjectionMatrix();

			// Update renderer
			this.#renderer.setSize(this.#sizes.width, this.#sizes.height);
			this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.#renderer.setColor('#262837')
			this.#renderer.shadowMap.type = THREE.PCFShadowMap;
		});
	}

	initCamera(){
		this.#camera = new THREE.PerspectiveCamera(
			75,
			this.#sizes.width / this.#sizes.height,
			0.1,
			100,
		);
		this.#camera.position.x = 0;
		this.#camera.position.y = 0.15;
		this.#camera.position.z = 1.33;
		this.#scene.add(this.#camera)
		this.#camera.lookAt(new THREE.Vector3(0,0	,-1));
	}

	initRenderer(){
		this.#renderer = new THREE.WebGLRenderer({
			canvas: this.#canvas,
		});
		this.#renderer.setSize(this.#sizes.width, this.#sizes.height);
		this.#renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.#renderer.shadowMap.enabled = true;
		this.#composer = new Composer(this.#scene,this.#camera,this.#renderer );
	}

	initLights(){
		this.#naturalLight = new NaturalLight(this.#scene, this.gui,this.#composer);
		this.#naturalLight.setLights(0.02, 0.75, true);
	}

	getScene() {
		return this.#scene
	}

	getComposer(){
		return this.#composer
	}

	addObject(mesh){
		this.#scene.add(mesh);
		this.objects.push(mesh);
	}

	update(){
		this.water.material.uniforms['time'].value += 1.0 / 60.0;

		// Render
		this.#composer.render()
	}

	setWater(){
		this.geometry =  new THREE.PlaneGeometry( 1000, 1000);
		this.water = new Water(
			this.geometry,
			{
				textureWidth: 512,
				textureHeight: 512,
				waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

					texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

				} ),
				sunDirection: new THREE.Vector3(),
				sunColor: "#aad0f7",
				waterColor: "#0e2626",
				distortionScale: 3.7,
				fog: this.#scene.fog !== undefined
			}
		);
		this.water.rotation.x = (- Math.PI / 2);
		this.water.position.y = -0.75;
		this.#scene.add(this.water)
	}



}