import * as THREE from 'three';

export default class Firefly {
    static _geometry;
    static firelfies = []
    static center;
    #material;
    mesh;
    static lastPos = new THREE.Vector3();
    params;
    visualRange = 0.5
    static bounce = {
        turnFactor: 0.075,
    };
    static centeringFactor = 0.03;
    static avoidFactor = 0.1;
    static matchingFactor = 0.05;
    static distanceHands;



    constructor(scene,composer) {

        if (!Firefly._geometry) {
            Firefly._geometry = new THREE.SphereGeometry(0.01, 36, 16);
        }
        this.#setMaterial()
        this.mesh = new THREE.Mesh(Firefly._geometry,this.#material);

        this.mesh.layers.toggle( composer.BLOOM_SCENE )
        Firefly.firelfies.push(this)
        this.initParams()
        this.mesh.position.x = this.params.x;
        this.mesh.position.y = this.params.y;
        this.mesh.position.z = this.params.z;

    }

    static iniGui(gui){
        gui.add(Firefly,"centeringFactor",0,0.2).name("coherence");
        gui.add(Firefly,"avoidFactor",0,0.1).name('separation');
        gui.add(Firefly,"matchingFactor",0,0.1).name("alignment");
    }

    initParams(){
        this.params = {
            x: (Math.random()-0.5) * 3,
            y: (Math.random()-0.5) * 3,
            z: (Math.random()-0.5),
            dx: (Math.random()-0.5)*0.1,
            dy: (Math.random()-0.5)*0.1,
            dz: (Math.random()-0.5)*0.1,
            history: []
        }
    }

    keepWithinBounds() {
        const turnFactor = Firefly.bounce.turnFactor;

        if (this.mesh.position.x < -1) {
            this.params.dx += turnFactor;
        }
        if (this.mesh.position.x > 1) {
            this.params.dx -= turnFactor
        }
        if (this.mesh.position.y < -1) {
            this.params.dy += turnFactor;
        }
        if (this.mesh.position.y > 1) {
            this.params.dy -= turnFactor;
        }
        if (this.mesh.position.z < -0.75) {
            this.params.dz += turnFactor;
        }
        if (this.mesh.position.z > 1) {
            this.params.dz -= turnFactor;
        }
    }
    flyTowardsCenter() {
        const centeringFactor = 0.15; // adjust velocity by this %

        let centerX = 0;
        let centerY = 0;
        let centerZ = 0;
        let numNeighbors = 0;

        for (let firefly of Firefly.firelfies) {
            if (Firefly.distance(this, firefly) < this.visualRange) {
                centerX += firefly.mesh.position.x;
                centerY += firefly.mesh.position.y;
                centerZ += firefly.mesh.position.z;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            centerX = Firefly.center ? Firefly.center.x : centerX / numNeighbors;
            centerY = Firefly.center ? Firefly.center.y : centerY / numNeighbors;
            centerZ = Firefly.center ? Firefly.center.z : centerZ / numNeighbors;

            if(Firefly.center && Firefly.distanceHands){
                this.params.dx = (centerX - this.mesh.position.x) * Firefly.centeringFactor;
                this.params.dy = (centerY - this.mesh.position.y) * Firefly.centeringFactor;
                this.params.dz = (centerZ - this.mesh.position.z) * Firefly.centeringFactor;
            }
            else{
                this.params.dx += (centerX - this.mesh.position.x) * Firefly.centeringFactor;
                this.params.dy += (centerY - this.mesh.position.y) * Firefly.centeringFactor;
                this.params.dz += (centerZ - this.mesh.position.z) * Firefly.centeringFactor;
            }

        }
    }

    static distance(boid1, boid2) {
        return boid1.mesh.position.distanceTo(boid2.mesh.position);
    }

    avoidOthers() {
        const minDistance = 0.1; // The distance to stay away from other boids
        const avoidFactor = 0.1; // Adjust velocity by this %
        let moveX = 0;
        let moveY = 0;
        let moveZ = 0;
        for (let firefly of Firefly.firelfies) {
            if (firefly !== this) {
                if (Firefly.distance(this, firefly) < minDistance) {
                    moveX += this.mesh.position.x - firefly.mesh.position.x;
                    moveY += this.mesh.position.y - firefly.mesh.position.y;
                    moveZ += this.mesh.position.z - firefly.mesh.position.z;
                }
            }
        }

        this.params.dx += moveX * Firefly.avoidFactor;
        this.params.dy += moveY * Firefly.avoidFactor;
        this.params.dz += moveZ * Firefly.avoidFactor;

    }

    matchVelocity() {
        let avgDX = 0;
        let avgDY = 0;
        let avgDZ= 0;
        let numNeighbors = 0;

        for (let firefly of Firefly.firelfies) {
            if (Firefly.distance(this, firefly) < this.visualRange) {
                avgDX += firefly.params.dx;
                avgDY += firefly.params.dy;
                avgDZ += firefly.params.dz;
                numNeighbors += 1;
            }
        }

        if (numNeighbors) {
            avgDX = avgDX / numNeighbors;
            avgDY = avgDY / numNeighbors;
            avgDZ = avgDZ / numNeighbors;


            this.params.dx += (avgDX - this.params.dx) * Firefly.matchingFactor;
            this.params.dy += (avgDY - this.params.dy) * Firefly.matchingFactor;
            this.params.dz += (avgDZ - this.params.dz) * Firefly.matchingFactor;

        }
    }

    limitSpeed() {
        const speedLimit = 0.05;

        const speed = Math.sqrt(Math.pow(this.params.dx * this.params.dx,2) + Math.pow( this.params.dy * this.params.dy,2) + Math.pow( this.params.dz * this.params.dz,2));
        if (speed > speedLimit) {
            this.params.dx = (this.params.dx / speed) * speedLimit;
            this.params.dy = (this.params.dy / speed) * speedLimit;
            this.params.dz = (this.params.dz / speed) * speedLimit;
        }
    }

    #setMaterial(){
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        this.#material = new THREE.MeshToonMaterial();
        this.#material.color = new THREE.Color("#"+randomColor);
    }

    getMesh(){
        return this.mesh;
    }

    update(){
        this.flyTowardsCenter();
        this.avoidOthers();
        this.matchVelocity();
        this.limitSpeed();
        this.keepWithinBounds();
        if(Firefly.center && Firefly.distanceHands){
            Firefly.avoidFactor = 0.1 * (Firefly.distanceHands -0.3)
            Firefly.centeringFactor = 0.15
        }
        else if(Firefly.center && Firefly.avoidFactor != 0.1 && Firefly.centeringFactor != 0.03){
            Firefly.avoidFactor = 0.1;
            Firefly.centeringFactor = 0.15
        }
        else if(Firefly.avoidFactor != 0.1){
            Firefly.avoidFactor = 0.1;
        }
        else if(Firefly.centeringFactor != 0.03){
            Firefly.centeringFactor = 0.03
        }

        // Update the position based on the current velocity
        this.mesh.position.x += this.params.dx;
        this.mesh.position.y += this.params.dy;
        this.mesh.position.z += this.params.dz;
    }

}