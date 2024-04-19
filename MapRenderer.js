import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { TileNode } from './TileNode.js'

export class MapRenderer {

	constructor(start, tileSize, cols) {

		this.start = start;
		this.tileSize = tileSize;
		this.cols = cols;

		this.groundGeometries = new THREE.BoxGeometry(0,0,0);

		// I've created a map here to hold 
		// reference to other tiles (non terrain)
		this.nonTerrainTiles = new Map();
	
	}

	createRendering(graph, scene) {
		// Iterate over all of the 
		// indices in our graph
		for (let node of graph) {

			this.createGround(node);
			this.setTile(node, scene);

		}
		let groundMaterial = new THREE.MeshStandardMaterial({ color: 0x0e87cc });

		let gameObject = new THREE.Group();
		let ground = new THREE.Mesh(this.groundGeometries, groundMaterial);

		gameObject.add(ground);

		scene.add(gameObject);
	}

	createGround(node) {


		let x = (node.x * this.tileSize) + this.start.x;
		let y = 0;
		let z = (node.z * this.tileSize) + this.start.z;

		let height = this.tileSize;


		let geometry = new THREE.BoxGeometry(this.tileSize,
											 height, 
											 this.tileSize);
		geometry.translate(x + 0.5 * this.tileSize,
						   y + 0.5 * height,
						   z + 0.5 * this.tileSize);

		
		this.groundGeometries = BufferGeometryUtils.mergeGeometries(
										[this.groundGeometries,
										geometry]
									);


	}

	// Sets the tile graphics in the scene
	setTile(node, scene) {

		if (this.nonTerrainTiles.has(node)) {
			scene.remove(this.nonTerrainTiles.get(node));
		}
		
		if (node.type != TileNode.Type.Water) {
			let x = (node.x * this.tileSize) + this.start.x;
			let y = this.tileSize;
			let z = (node.z * this.tileSize) + this.start.z;

			let height = this.tileSize;


			let geometry = new THREE.BoxGeometry(this.tileSize,
												 height, 
												 this.tileSize);
			geometry.translate(x + 0.5 * this.tileSize,
							   y + 0.5 * height,
							   z + 0.5 * this.tileSize);

			let gameObject = new THREE.Group();

			/**
			TODO:
			ADD MORE CODE HERE FOR DIFFERENT TILE TYPES
			**/
			let material, mesh;
			switch (node.type) {
				case (TileNode.Type.SomethingElse):
					material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
					mesh = new THREE.Mesh(geometry, material);

					gameObject.add(mesh);
					break;

				case(TileNode.Type.Ground):
					material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
					mesh = new THREE.Mesh(geometry, material);

					gameObject.add(mesh);
					break;
			}


			this.nonTerrainTiles.set(node, gameObject);
			scene.add(this.nonTerrainTiles.get(node));
		}
		
		

	}




}