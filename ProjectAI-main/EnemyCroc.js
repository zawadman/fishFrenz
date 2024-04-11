import { NPC } from './Behaviour/NPC.js';
import { State, ChaseState } from './State.js';
import * as THREE from 'three';



export class EnemyCroc extends NPC{
    constructor(mColor){
        super(mColor);
        this.fishEaten=0;


        //this.size = 20;
        let texture = new THREE.TextureLoader().load('croc_copy.jpg');
        let cubeGeo = new THREE.BoxGeometry(10,10,10);//needs implementation
        let cubeMat = new THREE.MeshStandardMaterial({map: texture});
        
        let mesh =  new THREE.Mesh(cubeGeo,cubeMat);
        mesh.position.y = mesh.position.y+1;
		// Rotate our X value of the mesh so it is facing the +z axis
		mesh.rotateX(Math.PI/2);
        
        this.gameObject = new THREE.Group();
		this.gameObject.add(mesh);
        
        this.state = new ChaseState();
        this.state.enterState(this);
    }

    update(deltaTime,gameMap,fish) {
		super.update(deltaTime,this.gameObject);

		this.state.updateState(this,gameMap, fish);
	}
}