import * as THREE from 'three';
import { CollisionDetector } from './CollisionDetector.js';
import { VectorUtil } from './Util/VectorUtil.js';

export class Character {

	// Character Constructor
	constructor(mColor) {
		this.size = 5
        	

		// Initialize movement variables
		this.location = new THREE.Vector3(0,0,0);
		this.velocity = new THREE.Vector3(0,0,0);
		this.acceleration = new THREE.Vector3(0, 0, 0);

		this.topSpeed = 15;
		this.mass = 1;
		this.maxForce = 15;

		this.wanderAngle = null;
	}

	// update character
	update(deltaTime, gameObject) {
		this.gameObject=gameObject;
		
		// update velocity via acceleration
		this.velocity.addScaledVector(this.acceleration, deltaTime);
		if (this.velocity.length() > this.topSpeed) {
			this.velocity.setLength(this.topSpeed);
		}

		// update location via velocity
		this.location.addScaledVector(this.velocity, deltaTime);

		// rotate the character to ensure they face 
		// the direction of movement
		let angle = Math.atan2(this.velocity.x, this.velocity.z);
		this.gameObject.rotation.y = angle;

		this.checkEdges();
		// set the game object position
		this.gameObject.position.set(this.location.x, this.location.y+0.25*this.size, this.location.z);

		this.acceleration.multiplyScalar(0);
	
	}
	// check we are within the bounds of the world
	checkEdges() {
       
        if (this.location.x < -this.edge_x) {
            this.location.x = this.edge_x;
        } 
   
        if (this.location.z < -this.edge_z) {
            this.location.z = this.edge_z;
        }
   
        if (this.location.x > this.edge_x) {
            this.location.x = -this.edge_x;
        }
 
        if (this.location.z > this.edge_z) {
            this.location.z = -this.edge_z;
        }
    }

	// Apply force to our character
	applyForce(force) {
		// here, we are saying force = force/mass
		force.divideScalar(this.mass);
		// this is acceleration + force/mass
		this.acceleration.add(force);
	}

	// Seek steering behaviour
	seek(target) {
		let desired = new THREE.Vector3();
		desired.subVectors(target, this.location);
		desired.setLength(this.topSpeed);

		let steer = new THREE.Vector3();
		steer.subVectors(desired, this.velocity);

		if (steer.length() > this.maxForce) {
			steer.setLength(this.maxForce);
		}
		return steer;
	}

	// Wander steering behaviour
  	wander() {
  		let d = 10;
  		let r = 10;
  		let a = 0.3;

  		let futureLocation = this.velocity.clone();
  		futureLocation.setLength(d);
  		futureLocation.add(this.location);



  		if (this.wanderAngle == null) {
  			this.wanderAngle = Math.random() * (Math.PI*2);
  		} else {
  			let change = Math.random() * (a*2) - a;
  			this.wanderAngle = this.wanderAngle + change;
  		}

  		let target = new THREE.Vector3(r*Math.sin(this.wanderAngle), 0, r*Math.cos(this.wanderAngle));
  		target.add(futureLocation);
  		return this.seek(target);

  	}


	getCollisionPoint(obstaclePosition, obstacleRadius, prediction) {

		// Get the vector between obstacle position and current location
		let vectorA = VectorUtil.sub(obstaclePosition, this.location);
		// Get the vector between prediction and current location
		let vectorB = VectorUtil.sub(prediction, this.location);

		// find the vector projection
		// this method projects vectorProjection (vectorA) onto vectorB 
		// and sets vectorProjection to the its result
		let vectorProjection = VectorUtil.projectOnVector(vectorA, vectorB);
		vectorProjection.add(this.location);
		

		// get the adjacent using trigonometry
		let opp = obstaclePosition.distanceTo(vectorProjection);
		let adj = Math.sqrt((obstacleRadius*obstacleRadius) - (opp*opp));
		
		// use scalar projection to get the collision length
		let scalarProjection = vectorProjection.distanceTo(this.location);
		let collisionLength = scalarProjection - adj;

		// find the collision point by setting
		// velocity to the collision length
		// then adding the current location
		let collisionPoint = VectorUtil.setLength(this.velocity, collisionLength);
		collisionPoint.add(this.location);

		console.log("getting collision point")
		return collisionPoint;
	}
	avoidCollision(obstaclePosition, obstacleRadius, time) {

		let steer = this.wander();

		let prediction = VectorUtil.multiplyScalar(this.velocity, time);
		prediction.add(this.location);
			
		let collision = CollisionDetector.lineCircle(this.location, prediction, obstaclePosition, obstacleRadius);
		//console.log(collision);


		if (collision) {
			let collisionPoint = this.getCollisionPoint(obstaclePosition,obstacleRadius,prediction);


			let normal  = VectorUtil.sub(collisionPoint, obstaclePosition);
			normal.setLength(205);

			let target = VectorUtil.add(collisionPoint, normal);

			
			steer = this.seek(target);
			

		}
        console.log("avoiding collision by ");
		return steer;

	}



}