// Created by Jackson Gerard 4/15/2022
// This took roughly 5 hours - didn't run into any jarring bugs

// Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (20)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// Implement parallax scrolling (10)
// Create a new animated sprite for the Spaceship enemies (10) (Look at the fire!)
// Display the time remaining (in seconds) on the screen (10)
// Implement the speed increase that happens after 30 seconds in the original game (5)
// Allow the player to control the Rocket after it's fired (5) (Only on Novice mode)


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;