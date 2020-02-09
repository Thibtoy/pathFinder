import {Scenario} from './scenario.js';

export class PathFinder {
	constructor(startPoint, deplacementField, endPoint) {
		this.state = {startPoint, deplacementField, endPoint, position: startPoint}
		this.results = new Array();
		this.scenarios = new Array();
		this.scenarios.push(new Scenario(
			this.state.startPoint, 
			this.state.deplacementField, 
			this.state.endPoint, 
			this.results,
			this.scenarios,
		));
	}

	run() {
		while (this.statut != 'end') {
			let end = true;
			if (this.results.length > 0) this.cost = this.getBestWay().state.mouvement;
			for (let i = 0, l = this.scenarios.length; i < l; i++) {
				if (this.scenarios[i].statut === "running") {
					if (this.cost && this.scenarios[i].state.mouvement > this.cost) this.scenarios[i].statut = "echec";
					else {
						end = false;
						this.scenarios[i].mouve();
					} 
				}
			}
			if (end) this.statut = "end";
		}
	}

	getBestWay() {
		let bestWay = false;
		for (let i = 0, l = this.results.length; i < l; i++) {
			bestWay = (!bestWay)? this.results[i]: bestWay;
			bestWay = (this.results[i].state.mouvement < bestWay.state.mouvement)? this.results[i]: bestWay; 
		}
		return bestWay;
	}
}