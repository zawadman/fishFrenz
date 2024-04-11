export class TileNode {

	// CHANGE TILE TYPES HERE
	static Type = Object.freeze({
		Ground: Symbol("ground"),
		SomethingElse: Symbol("something-else"),
		Water: Symbol("water")
	})


	// Node Constructor
	constructor(id, x, z, type) {
		this.id = id;
		this.x = x;
		this.z = z;

		this.edges = [];

		this.type = type;
	}

	// Try to add an edge to this node
	tryAddEdge(node, cost) {
		if (node.type === TileNode.Type.Ground || node.type === TileNode.Type.Water) {
			this.edges.push({node: node, cost: cost});
		}
	}

	// Test if this node has an edge to the neighbour
	getEdge(node) {
		return this.edges.find(x => x.node === node);
	}

	// Test if edge by direction exists
	hasEdge(node) {
		if (this.getEdge(node) === undefined)
			return false;
		return true;

	}

	// Test if has edge to a particular location
	hasEdgeTo(x, z) {
		let edge = this.getEdgeTo(x,z);
		if (edge === undefined)
			return false;
		return true;
	}

	// Get an edge to a particular location
	getEdgeTo(x, z) {
		return this.edges.find(e => (e.node.x === x) && (e.node.z === z));
	}


}