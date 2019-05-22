# JSteroids

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Pejo-306/JSteroids/blob/master/LICENSE) [![GitHub release](https://img.shields.io/badge/release-v1.0.1-brightgreen.svg)](https://github.com/Pejo-306/JSteroids/releases/) [![Phaser 3](https://img.shields.io/badge/Built%20with-Phaser%203-orange.svg)](https://github.com/photonstorm/phaser) [![Heroku](https://img.shields.io/badge/Hosted%20on-Heroku-blueviolet.svg)](https://tranquil-bayou-90414.herokuapp.com/)

JSteroids is a recreation of the classical retro game Asteroids. The project
itself is an HTML5 game created with the help of the open-source game engine
[Phaser 3](https://github.com/photonstorm/phaser) which is based on JavaScript.

## Table of contents

* [Game Description](#game-description)
* [Play the Game](#play-the-game)
* [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running on a Local Server](#running-on-a-local-server)
  - [Running in a Production Environment](#running-in-a-production-environment)
* [Built with](#built-with)
* [License](#license)

## Game Description

The game is a 2D top-down view shooter. The player controls a spaceship which
may navigate around in space and fire projectiles. The game's main objective
is to destroy asteroids which spawn endlessly in waves. With each wave, the
number of asteroids increases by multiplying the previous wave's asteroid count
with a level multiplier which depends on the player's score. Asteroids come
in several levels with each next level of asteroids being faster and smaller 
than the previous.

Saucers are the player's main enemy. They spawn randomly every so often and
shoot in random directions. Like asteroids, saucers also come in a few levels
with each next level of saucers being faster and smaller than the previous 
level. Saucers can be destroyed by colliding with either the player or
their projectiles. However, these enemies bounce off asteroids on collision.

Each player-destroyable object (asteroids and saucers) give the player some
amount of score. The objective of the game is to achieve a higher score before
the player loses all of their lives. After the game ends, the player has the
option of returning to the main menu or to directly restart the game.

## Play the Game

This project is currently deployed on Heroku. You may visit the following app
to play JSteroids without performing any setup:

https://tranquil-bayou-90414.herokuapp.com/

## Getting Started

The following instructions will get you a running copy of the game on your
local machine.

### Prerequisites

You must have installed nodejs and npm in order to run this project. The latest
versions used in this project are:

* nodejs v10.15.3
* npm 6.4.1

### Installation

To get a copy of the game, all you need to do is clone this Github repository.

```bash
$ git clone https://github.com/Pejo-306/JSteroids.git
$ cd JSteroids/
```

Then install all npm packages.

```bash
$ npm install
```

### Running on a Local Server

Run webpack's development server.

```bash
$ npm run dev
```

Afterward, open your browser and visit **localhost:8000**.

And you're good to go. Enjoy playing the game :).

### Running in a Production Environment

In order to deploy the game in a production environment, you must start the
provided simple Express.js server. To run the server use the following npm script:

```bash
$ npm start
```

## Built with

* [Phaser 3](https://github.com/photonstorm/phaser)

## License

This project is distributed under the [MIT license](LICENSE).

