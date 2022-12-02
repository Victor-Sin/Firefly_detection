import * as THREE from 'three';

export default class Visualizer {
    static _geometry;
    static visualizers = []
    #material;
    mesh;
    lastPos = new THREE.Vector3();
    params;

    constructor(scene,composer) {

        if (!Visualizer._geometry) {
            Visualizer._geometry = new THREE.IcosahedronGeometry(0.025, 0);
        }
        this.#setMaterial()
        this.mesh = new THREE.Mesh(Visualizer._geometry,this.#material);
        this.mesh.layers.toggle( composer.BLOOM_SCENE )

        Visualizer.visualizers.push(this)
    }

    #setMaterial(){
        this.#material = new THREE.MeshToonMaterial();
    }

    lerp(v0, v1, t) {
        return v0 * (1 - t) + v1 * t;
    }

    setPosition(elt){
        if(elt){
            this.mesh.position.x = this.lerp(-elt.x,this.lastPos.x,0.5) ;
            this.mesh.position.y = this.lerp(-elt.y,this.lastPos.y,0.5);
            this.mesh.position.z = this.lerp(-elt.z,this.lastPos.z,0.5);
            this.lastPos.x = this.mesh.position.x;
            this.lastPos.y = this.mesh.position.y;
            this.lastPos.z = this.mesh.position.z;
        }
    }

    static calcHalf(point1,point2){
        let p1 = new THREE.Vector3(point1.x, point1.y, point1.z);
        let p2 = new THREE.Vector3(point2.x, point2.y, point2.z);
        let mid = new THREE.Vector3();
        mid.x = p1.x + (p2.x - p1.x) /2;
        mid.y = p1.y + (p2.y - p1.y) /2;
        mid.z = p1.z + (p2.z - p1.z) /2;
        return mid

    }

    getMesh(){
        return this.mesh;
    }

}