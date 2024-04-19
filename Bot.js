import { Character } from './Character.js';
import * as THREE from 'three';

export class Bot extends Character{
    constructor(mColor){
        super(mColor);
        let texture = new THREE.TextureLoader().load('fish.jpg');
        let coneGeo = new THREE.ConeGeometry(1, 10, 32);
        let coneMat = new THREE.MeshBasicMaterial({map: texture});

        let coneMesh =  new THREE.Mesh(coneGeo,coneMat);
        coneMesh.position.y = coneMesh.position.y+1;
		// Rotate our X value of the mesh so it is facing the +z axis
		coneMesh.rotateX(Math.PI/2);

        this.gameObject = new THREE.Group();
		this.gameObject.add(coneMesh);
    }
    update(deltaTime) {
		super.update(deltaTime,this.gameObject);

	}


}