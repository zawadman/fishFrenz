
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { Graph } from './Graph';
import { PriorityQueue } from './Util/PriorityQueue';


export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {

		// Define some basics of our world
		// Let's use the previous area that we had
		// our character navigating around
		// This started at location (-25,0,-25)
		// and had width of 50 and a depth of 50
		this.start = new THREE.Vector3(-100,0,-50);

		this.width = 200;//x
		this.depth = 100;//z
		
		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 5;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our graph
		// Which is an array of nodes
		this.graph = new Graph(this.tileSize, this.cols, this.rows);

		// Create our map renderer
		this.mapRenderer = new MapRenderer(this.start, this.tileSize, this.cols);
	}

	init(scene) {
		this.scene = scene; 
		this.graph.initGraph();
		// Set the game object to our rendering
		this.mapRenderer.createRendering(this.graph.nodes, scene);
	}

	// Method to get location from a node
	localize(node) {
		let x = this.start.x+(node.x*this.tileSize)+this.tileSize*0.5;
		let y = this.tileSize;
		let z = this.start.z+(node.z*this.tileSize)+this.tileSize*0.5;

		return new THREE.Vector3(x,y,z);
	}

	quantize(location) {
		let x = Math.floor((location.x - this.start.x)/this.tileSize);
		let z = Math.floor((location.z - this.start.z)/this.tileSize);

		return this.graph.getNode(x,z);
	}
	backtrack(start, end, parents) {
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			path.push(parents[node.id]);
			node = parents[node.id];
		}
		return path.reverse();
	}

	manhattanDistance(node, end) {
		if(node==undefined){
			console.log('start is undefined');
		}
		if(end==undefined){
			console.log('end is undefined');
		}
		let nodePos = this.localize(node);
		let endPos = this.localize(end)

		let dx = Math.abs(nodePos.x - endPos.x);
		let dz = Math.abs(nodePos.z - endPos.z);
	 	return dx + dz;

	}
	astar(start, end) {
		let open = new PriorityQueue();
		let closed = [];

		open.enqueue(start, 0);

		// For the cheapest node "parent" and 
		// the cost of traversing that path
		let parent = [];
		let g = [];

		// Start by populating our table
		for (let node of this.graph.nodes) {
			if (node == start) {
				g[node.id] = 0;
			} else {
				g[node.id] = Number.MAX_VALUE;
			}
			parent[node.id] = null;
		}


		// Start our loop
		while (!open.isEmpty()) {


			let current = open.dequeue();
			closed.push(current);


			if (current == end) {
				return this.backtrack(start, end, parent);
			}

			for (let i in current.edges) {

				let neighbour = current.edges[i];
				let pathCost = neighbour.cost + g[current.id];

				if (pathCost < g[neighbour.node.id]) {

					parent[neighbour.node.id] = current;
					g[neighbour.node.id] = pathCost;

					if (!closed.includes(neighbour.node)) {

						if (open.includes(neighbour.node)) {
							open.remove(neighbour.node);
						}

						let f = g[neighbour.node.id] + this.manhattanDistance(neighbour.node, end);
						open.enqueue(neighbour.node, f);
					}
				}
			}
		}
		return null;
	}


	/**
	
	For use in A3:
	Sets the tile to a new type
	
	**/
	setTileType(node, type) {
		node.type = type;
		this.mapRenderer.setTile(node, this.scene);
		
	}
}
