import { Vector3 } from 'three';
import { Character } from './Character.js';
import { State } from './State';

export class Player extends Character {

	constructor(colour) {
		super(colour);
		this.frictionMagnitude = 20;

		// State
		this.state = new IdleState();

		this.state.enterState(this);
		this.bullets=[];
	}

	switchState(state) {
		this.state = state;
		this.state.enterState(this);
	}

	update(deltaTime, gameMap, controller, scene) {
		this.state.updateState(this, controller, scene);
		super.update(deltaTime, gameMap);
	}


}
export class Bullet extends Character{
	constructor(colour) {
		super(colour);
	}
	update(deltaTime, gameMap) {

		// update location via velocity
		this.location.addScaledVector(this.velocity, deltaTime);

		// rotate the character to ensure they face 
		// the direction of movement
		let angle = Math.atan2(this.velocity.x, this.velocity.z);
		this.gameObject.rotation.y = angle;


		// set the game object position
		this.gameObject.position.set(this.location.x, this.location.y+0.25*this.size, this.location.z);

	}
}
export class IdleState extends State {

	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
	}

	updateState(player, controller, scene) {
		if (controller.moving()) {
			player.switchState(new MovingState());
		}
		if(controller.shooting()){
			player.switchState(new ShootingState());
		}
	}

}

export class ShootingState extends State {
	enterState(player) {
		player.velocity.x = 0;
		player.velocity.z = 0;
	}
	updateState(player, controller, scene) {

		if (!controller.shooting()) {
			player.switchState(new IdleState());
		} 
		else {
			let force = player.gameObject.rotation.y;
			//new Vector3(50*Math.sin(force), 0, 50*Math.cos(force));
			console.log(new Vector3(50*Math.sin(force), 0, 50*Math.cos(force)));
			let bullet1=new Bullet(0xffff00);
			bullet1.location=player.location.clone();
			scene.add(bullet1.gameObject);
			bullet1.velocity=new Vector3(50*Math.sin(force), 0, 50*Math.cos(force));
			player.bullets.push(bullet1);
			//player.applyForce(new Vector3(50*Math.sin(force), 0, 50*Math.cos(force)));

		}
	}
}

export class MovingState extends State {

	enterState(player) {
	}

	updateState(player, controller, scene) {

		if (!controller.moving()) {
			player.switchState(new IdleState());
		} else {
			let force = controller.direction();
			force.setLength(50);
			player.applyForce(force);

		}	
	}

}