import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Character } from './Character.js';
import { Bot } from './Bot.js';
import { EnemyCroc } from './EnemyCroc.js';
import { GameMap } from './GameMap.js';
import { TileNode } from './TileNode.js';
import { Player } from './Behaviour/Player.js';
import { Controller} from './Behaviour/Controller.js';
import { IdleState } from './State.js';
import { Pseudorandom } from './Pseudorandom.js';
import { Snow } from './Snow.js';
// Create Scene
const pseudorandom = new Pseudorandom();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const orbitControls = new OrbitControls(camera, renderer.domElement);
// Create GameMap
const gameMap = new GameMap();
// Create clock
const clock = new THREE.Clock();
//camera.lookAt(scene.position)
// Controller for player
const controller = new Controller(document);

// Create player
const player = new Player(new THREE.Color(0xff0000));

const enemy = new EnemyCroc(new THREE.Color(0x00ffff));

//create Snow
var snow = new Snow(scene,1000);

let fishes=[];
for(let i=0; i<15; i++){
	let bot = new Bot(new THREE.Color(0xffff00));
	bot.edge_x=50; bot.edge_z=49;
	fishes.push(bot);
}
function randomWaterTile(i){
	//let a=gameMap.graph.nodes[Math.floor(gameMap.graph.nodes.length*Math.random())];
	let a=gameMap.graph.nodes[Math.floor(pseudorandom.halton(3, i, 0, gameMap.graph.nodes.length))];
	console.log(pseudorandom.halton(3, i, 0, gameMap.graph.nodes.length));
	while(a.type!=TileNode.Type.Water){
		a=gameMap.graph.nodes[Math.floor(pseudorandom.halton(3, i, 0, gameMap.graph.nodes.length))];
		if(a==undefined){console.log(pseudorandom.halton(3, i, 0, gameMap.graph.nodes.length))}
		i++;
	}
	console.log(a);
	return a;
}
// Create NPC
//const bot = new Bot(new THREE.Color(0x0000ff));
// Setup our scene
function setup() {
	scene.background = new THREE.Color(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	camera.position.y = 80;
	camera.lookAt(0,0,0);
	//Create Light
	let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 25, 0);
	scene.add(directionalLight);
	// initialize our gameMap
	gameMap.init(scene);

	player.location = gameMap.localize(gameMap.graph.nodes[205]);
	player.location.y=10;
	// set character locations 
	enemy.location = gameMap.localize(gameMap.graph.nodes[355]);
	// add our characters to the scene
	scene.add(enemy.gameObject);
	scene.add(player.gameObject);

	for(let i=0; i<15; i++){
		fishes[i].location=gameMap.localize(randomWaterTile(i));
		scene.add(fishes[i].gameObject);
	}
	// add our characters to the scene
	//scene.add(bot.gameObject);
	//First call to animate

	animate();
}
// animate
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

	let deltaTime = clock.getDelta();


	enemy.update(deltaTime,gameMap,fishes[0]);
	player.update(deltaTime, gameMap, controller, scene);

	for(let i=0; i<fishes.length; i++){
		fishes[i].applyForce(fishes[i].avoidCollision(enemy.location,15,1));
		fishes[i].update(deltaTime);
		if(gameMap.quantize(fishes[i].location)==gameMap.quantize(enemy.location)){
			console.log(i);
			enemy.fishEaten+=1;
			scene.remove(fishes[i].gameObject);
			fishes.splice(i,1);
		}
		else if(gameMap.quantize(fishes[i].location)==gameMap.quantize(player.location)){
			console.log(i);
			scene.remove(fishes[i].gameObject);
			fishes.splice(i,1);
		}
	}

	if(enemy.fishEaten>2){
		document.getElementById("info").innerHTML ='You Lose';
	}
	else if(fishes.length==0){
		document.getElementById("info").innerHTML ='You WIN!';
	}
	for(let i=0; i<player.bullets.length;i++){
		player.bullets[i].update(deltaTime, gameMap);
		if(Math.abs(player.bullets[i].location.x)>100 || Math.abs(player.bullets[i].location.z)>50){
			scene.remove(player.bullets[i].gameObject);
			player.bullets.splice(i,1);
		}
		else {
			
			let distance = player.bullets[i].location.distanceTo(enemy.location);
			if(distance <= 10){ // Assuming 10 is the hit radius around the enemyCroc
				scene.remove(player.bullets[i].gameObject);
				player.bullets.splice(i, 1);
				enemy.state = new IdleState();
        		enemy.state.enterState(enemy);
			}
		}
	}
	snow.animate(deltaTime);

	orbitControls.update();
}
setup();