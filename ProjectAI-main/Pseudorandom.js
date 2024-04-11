export class Pseudorandom {
	
	constructor() {
		this.m = 134456;
		this.a = 8121;
		this.c = 28411;

		this.seed = this.m/2;
	}

	lcg(start, end) {
		this.seed = (this.a * this.seed + this.c) % this.m;
		let output = ((this.seed/this.m) * (end-start)) + start;
		return output;
	}

	halton(base, index, start, end) {

		let result = 0;
		let denominator = 1;

		while (index > 0) {
			denominator = denominator * base;
			result = result + (index % base) / denominator;
			index = Math.floor(index/base);
		}
		let output = ((result) * (end - start)) + start;
		return output;

	}


	gaussian(start, end) {

		let u1 = this.lcg(0,1);
		let u2 = this.lcg(0,1);

		let zScore = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

		let mean = 0.5;
		let stddev = 0.15;

		let result = zScore * stddev + mean;
		let output = ((result) * (end - start)) + start;
		return output;

	}

	higherMoreLikely(start, end) {

		while (true) {
			let r1 = this.lcg(0,1);
			let probability = r1;
			let r2 = this.lcg(0,1);

			if (r2 < probability) {
				return (r1 * (end - start)) + start;
			}
		}

	}



}