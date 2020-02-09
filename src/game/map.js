import {Tileset} from './tileset.js';
import ground from '../public/images/tilesets/ground.png';
import tiles from '../public/images/tilesets/tiles.png';
const IMG = {
	ground,
	tiles,
}

export class Map {
	constructor(map) {
		this.layers = new Array();
		for (let layer in map) {
			this.layers.push({
				tileset: new Tileset(IMG[map[layer].tileset]),
				field: map[layer].field
			});
		};
	}
	

	addUnit(unit) {
		this.unit = unit;
	}

	getHeight() {
		return this.layers[0].field.length;
	}

	getWidth() {
		return this.layers[0].field[0].length;
	}

	drawMap(context, callback) {
		this.layers.forEach(function(layer) {
			for (let i = 0, l = layer.field.length; i < l; i++){
				let line = layer.field[i];
				let y = i*32;
				for(var j = 0, k = line.length ; j < k ; j++) {
					let x = j*32;
					if(line[j] != "00")layer.tileset.drawTile(parseInt(line[j], 10), context, x, y);
				};
			};
		});
		if (this.unit) this.unit.draw(context, function(res) {callback(res)});
	}
}