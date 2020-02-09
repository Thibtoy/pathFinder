const DIRECTION = {
	TOP: {y: -1, x: 0, mouve: "MOUVE_TOP"},
	DOWN: {y: 1, x: 0, mouve: "MOUVE_DOWN"},
	RIGHT: {y: 0, x: 1, mouve: "MOUVE_RIGHT"},
	LEFT:  {y: 0, x: -1, mouve: "MOUVE_LEFT"}
}

export class Scenario {// ré implementer le not wantedDir, propre à chaque scenario (un scenario qui se lance en mouve right, not wanted left CQFD tmtc)
	constructor(startPoint, deplacementField, endPoint, results, scenarios, mouvement = 0, history = new Array(), route = new Array()) {
		this.state = {startPoint, deplacementField, endPoint, mouvement, history, position: startPoint};
		this.route = route;
		this.scenarios = scenarios;
		this.results = results;
		this.statut = "running";	
	}

	mouve() {
		this.direction = this.getDirection();
		this.bindNewScenarios(this.direction);
		if(this.mouveIsPossible(this.direction)) {
			this.state.history.push({y: this.state.position.y, x: this.state.position.x});
			this.state.position = {y: (this.state.position.y + this.direction.y), x: (this.state.position.x + this.direction.x)};
			this.route.push(this.direction.mouve);
			this.state.mouvement++;
			if(this.state.position.y === this.state.endPoint.y && this.state.position.x === this.state.endPoint.x) {
				this.results.push(this);
				this.statut = 'success';
			}
			else this.statut = "running";
		}
		else this.statut = "echec";
	}

	bindNewScenarios(nextDirection) {
		for (let dir in DIRECTION) {
			if (this.mouveIsPossible(DIRECTION[dir])) {
				if(nextDirection != DIRECTION[dir] && this.notInScenario(DIRECTION[dir])) {
					let position = {y: (this.state.position.y + DIRECTION[dir].y), x:(this.state.position.x + DIRECTION[dir].x)},
						history = this.copyArray(this.state.history),
						route = this.copyArray(this.route),
						mouvement = this.state.mouvement + 1;
					history.push(this.state.position);
					route.push(DIRECTION[dir].mouve);
					let newScenario = new Scenario(
						position, 
						this.state.deplacementField, 
						this.state.endPoint,
						this.results,
						this.scenarios,
						mouvement,
						history,
						route,
					);
					this.scenarios.push(newScenario);
				}
			};
		};
	}

	getDirection() {
		if (Math.abs(this.state.endPoint.y - this.state.position.y) > Math.abs(this.state.endPoint.x - this.state.position.x))
			return (this.state.endPoint.y < this.state.position.y)?  DIRECTION.TOP: DIRECTION.DOWN;
		else 
			return (this.state.endPoint.x < this.state.position.x)? DIRECTION.LEFT: DIRECTION.RIGHT;
	}

	mouveIsPossible(direction) {
		return (this.inField(direction)
			&& this.state.deplacementField.field[this.state.position.y + direction.y][this.state.position.x + direction.x] != "02" 
				&& this.notInHistory(direction)
				)? 
		true: false;
	}

	notInScenario(direction) {
		let that = this;
		if (this.scenarios.find(function(scenario){return (scenario.state.position.y === (that.state.position.y + direction.y)) && (scenario.state.position.x === (that.state.position.x + direction.x))})) 
			return false;
		else return true;
	}

	inField(direction) {
		let dirY = this.state.position.y + direction.y,
			dirX = this.state.position.x + direction.x;
		if (dirY >= 0 && dirX >= 0 && dirY < this.state.deplacementField.field.length && dirX < this.state.deplacementField.field[0].length) return true;
		else return false;
	}

	notInHistory(direction) {
		let that = this;
		if (this.state.history.find(function(position){return (position.y === (that.state.position.y + direction.y)) && (position.x === (that.state.position.x + direction.x))}))
			return false;
		else return true;
	}

	copyArray(array) {
		let newArray = new Array();
		for (let i = 0, l = array.length; i < l; i++) newArray[i] = array[i];
		return newArray;
	}
}