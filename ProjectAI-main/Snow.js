import * as THREE from 'three';
import { Perlin } from './Perlin.js';

export class Snow {
    constructor(scene, count) {
        this.scene = scene;
        this.count = count;
        this.snowflakes = [];
        this.snowStartsFrom=200;
        //this.perlin ; // Initialize Perlin with appropriate grid size
        this.perlin = new Perlin(10);
        this.init();
    }

    init() {
        const geometry = new THREE.SphereGeometry(1, 8, 4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });

        for (let i = 0; i < this.count; i++) {
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() -0.3 ) * this.snowStartsFrom, // Randomize x position
                Math.random() * 100 +50,   // Randomize y position above the scene
                (Math.random() -0.5 ) * this.snowStartsFrom  // Randomize z position
            );
            this.snowflakes.push(mesh);
            this.scene.add(mesh);
        }
    }

    animate(deltaTime) {
        this.snowflakes.forEach(snowflake => {
            // Adjust time scaling as needed to control the speed of the "wind" effect
            let time = Date.now() * 0.0001;
            let noise = this.perlin.octaveNoise(snowflake.position.x+300, snowflake.position.z+300, time, 20, 0.35);

            // Using noise to calculate more complex horizontal drift and variable fall speed
            snowflake.position.x += Math.cos(noise * Math.PI * 2.75) * 1;  // Enhanced horizontal drift
            snowflake.position.y -= deltaTime * (50 + noise * 20);  // Variable fall speed, adding some noise-based variance

            // Reset snowflake to the top when it falls below y = -10
            if (snowflake.position.y < -10) {
                snowflake.position.y = 100;
                snowflake.position.x = (Math.random() -0.3) * this.snowStartsFrom; // Re-randomize x position
                snowflake.position.z = (Math.random() -0.5) * this.snowStartsFrom; // Re-randomize z position
            }
        });
    }
}