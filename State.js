//import { Character } from './Character.js';
//import { EnemyCroc } from './EnemyCroc.js';
import * as THREE from 'three';

export class State {
	

	// Creating an abstract class in JS
	// Ensuring enterState and updateState are implemented
	constructor() {
	
	    if(this.constructor == State) {
	       throw new Error("Class is of abstract type and cannot be instantiated");
	    };

	    if(this.enterState == undefined) {
	        throw new Error("enterState method must be implemented");
	    };

	     if(this.updateState == undefined) {
	        throw new Error("updateState method must be implemented");
	    };
	
	}


}

export class ChaseState extends State{

    enterState(enemy) {
		enemy.topSpeed = 15;
		console.log("Chasing!!!!")

	}


	updateState(enemy,gameMap,fish) {

    let steer = enemy.followPlayer(gameMap, fish);
    enemy.applyForce(steer);

	
    }
}

export class IdleState extends State{

    enterState(enemy) {
		enemy.topSpeed = 0;
		console.log("idle!!!!")
		this.clock = new THREE.Clock();
		this.clock.start();
	}

	updateState(enemy,gameMap,fish) {
		if(this.clock.getElapsedTime()>=7){
			enemy.state= new ChaseState();
			enemy.state.enterState(enemy);
		}

    }
}