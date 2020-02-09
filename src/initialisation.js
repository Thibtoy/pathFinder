import {Map} from './game/map.js';
import mapData from './data/map.json';
import mountains from './public/images/mountains.png';
import startPoint from './public/images/startPoint.png';
import flag from './public/images/flag.png';
import {PathFinder} from './game/PathFinder.js';
import {Unit} from './game/unit.js';

const tiles = {
	mountains: {src: mountains, i: 0, value: '02', type: 'mountains'},
	startPoint: {src: startPoint, i: 32, value: '01', type: 'startPoint'},
	flag: {src: flag, i: 64, value: '03', type: 'flag'}
};

// import {mouvement} from './mouvement/mouvement.js';

var canva = document.getElementById('Canva');
var context = canva.getContext('2d');
var tilesBoard = document.getElementById('Tiles');
var button = document.getElementById('ValidateButton');
var currentTile;

for (let tile in tiles) {
	let img = document.createElement('img');
	img.src = tiles[tile].src;
	img.setAttribute('value', tiles[tile].value);
	img.setAttribute('type', tiles[tile].type);
	img.classList.add('tiles');
	//img.style.marginTop = tiles[tile].i+'px';
	img.addEventListener('click', selectTile);
	if(tile === 'mountains') {
		img.classList.add('selected');
		currentTile = img;
	}
	tilesBoard.insertBefore(img, button);
}

function selectTile(event) {
	currentTile.classList.remove('selected');
	currentTile = event.currentTarget;
	currentTile.classList.add('selected');
}

var map = new Map(mapData);
    	canva.width = map.getWidth()*32;
    	canva.height = map.getHeight()*32;
    	canva.style.position = "absolute";
		canva.style.left = "calc(50% - "+(canva.width/2)+"px)";
		canva.style.top = "calc(50% - "+(canva.height/2)+"px)";
		//map.battleField.addUnit(new Unit('Skull', 22, 3, 0));
		//map.battleField.addUnit(new Unit('Skull', 20, 3, 0));
		window.onload = function() {
			map.drawMap(context);
    		canva.addEventListener('mousemove', mouseMove);
    		canva.addEventListener('mousedown', click);
    		canva.addEventListener('mouseout', function(event) {
    			drawing = false;
    			if (oldPosition.clientY != -1 && !positions[oldPosition.clientY+'$'+oldPosition.clientX]) {
    				map.layers[1].field[oldPosition.clientY][oldPosition.clientX] = "00";
					oldPosition = {clientY: -1, clientX: -1};
					map.drawMap(context);
				}
			});
			canva.addEventListener('mouseup', function() {
				drawing = false;
			}); 
		}

// function tryMouve(event) {
// 	let clientY = Math.floor(event.layerY/32);
// 	let clientX = Math.floor(event.layerX/32);
// 	let way;
// 	for (let i = 0, l = this.deplacementField.length; i < l; i++) {
// 		let finded = this.deplacementField[i].find(
// 			scenario => (scenario 
// 				&& scenario.route 
// 					&& clientY === scenario.position.line 
// 						&& clientX === scenario.position.cell
// 			)
// 		);
// 		if (finded) way = finded;
// 	}
// 	if (way) moveUnit(this, way);
// 	else return;
// }

async function moveUnit (unit, way){
	console.log(way.length);
	for (let i = 0, l = way.length; i < l; i++) {
		let event = way.shift()
		switch (true) {
			case (event === 'MOUVE_DOWN'):
				unit.direction = 0;
				unit.y++;
				unit.etatAnimation = 1;
				break;
			case (event === 'MOUVE_TOP'):
				unit.direction = 3;
				unit.y--;
				unit.etatAnimation = 1;
				break;
			case (event === 'MOUVE_LEFT'):
				unit.direction = 1;
				unit.x--;
				unit.etatAnimation = 1;
				break;
			case (event === 'MOUVE_RIGHT'):
				unit.direction = 2;
				unit.x++;
				unit.etatAnimation = 1;
				break;
		}
		let mouve = new Promise(function(res, rej) {
			unit.animation = setInterval(function() {
				map.drawMap(context, function(resp) {
					if (resp) {
						res(true);
					}
				});
			}, 30);
		});
		await mouve;
	}
}


var oldPosition = {
	clientX: -1,
	clientY: -1
}

var positions = {};
var itineraire = {};
var drawing = false;

function mouseMove(event) {
	let clientY = Math.floor(event.layerY/32);
	let clientX = Math.floor(event.layerX/32);
	if (drawing) {
		let type = currentTile.getAttribute('type');
		positions[clientY+'$'+clientX] = currentTile.getAttribute('value');
		for (let type in itineraire) {
			if (itineraire[type].y && itineraire[type].y === clientY && itineraire[type].x === clientX) itineraire[type] = false;
		}
		if (type != 'mountains') {
			if (itineraire[type]) {
				positions[itineraire[type].y+'$'+itineraire[type].x] = "00";
				map.layers[1].field[itineraire[type].y][itineraire[type].x] = "00";
				map.drawMap(context);
			}
			itineraire[type] = {y: clientY, x: clientX};
		}
	}
	if (oldPosition.clientX != -1 && !positions[oldPosition.clientY+'$'+oldPosition.clientX]) map.layers[1].field[oldPosition.clientY][oldPosition.clientX] = "00";
	for (let key in positions) {
		let coords = key.split('$');
		let line = parseInt(coords[0], 10);
		let cell = parseInt(coords[1], 10);
		map.layers[1].field[line][cell] = positions[key];
	}
	if (!positions[clientY+'$'+clientX] || positions[clientY+'$'+clientX] != currentTile.getAttribute('value')) {
		map.layers[1].field[clientY][clientX] = currentTile.getAttribute('value');
		oldPosition = {clientY, clientX};
	}
    map.drawMap(context);  
}

function click(event) {
	let clientY = Math.floor(event.layerY/32);
	let clientX = Math.floor(event.layerX/32);
	drawing = true;
	let type = currentTile.getAttribute('type');
	positions[clientY+'$'+clientX] = currentTile.getAttribute('value');
	for (let type in itineraire) {
		if (itineraire[type].y && itineraire[type].y === clientY && itineraire[type].x === clientX) itineraire[type] = false;
	}
	if (type != 'mountains') {
		if (itineraire[type]) {
			positions[itineraire[type].y+'$'+itineraire[type].x] = "00";
			map.layers[1].field[itineraire[type].y][itineraire[type].x] = "00";
			map.drawMap(context);
		}
		itineraire[type] = {y: clientY, x: clientX};
	}
}

button.addEventListener('click', function() {
	let unit = new Unit(itineraire.startPoint.x, itineraire.startPoint.y, 0)
	let way = new PathFinder(itineraire.startPoint, map.layers[1], itineraire.flag)
	canva.removeEventListener('mousedown', click);
	canva.removeEventListener('mousemove', mouseMove);
	map.addUnit(unit);
	positions[itineraire.startPoint.y+'$'+itineraire.startPoint.x] = "00";
	map.layers[1].field[itineraire.startPoint.y][itineraire.startPoint.x] = "00";
	map.drawMap(context);
	way.run();
	way = way.getBestWay();
	console.log(way);
	moveUnit(unit, way.route);
})