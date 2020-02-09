const app = document.getElementById('app');
const title = document.createElement('h1');
const board = document.createElement('div');

title.innerHTML = 'Star Wars';
board.setAttribute('class', 'board');
app.appendChild(title);
app.appendChild(board);

class Table {
	constructor(name, data) {
		this.name = name;
		this.data = data;
	}

	render() {
		let col = document.createElement('div');	
		let title = document.createElement('h3');	
		let resultDiv = document.createElement('div');
		col.setAttribute('class', 'col');
		title.innerHTML = this.name;
		board.appendChild(col);
		col.appendChild(title);
		col.appendChild(resultDiv)
		this.data.forEach(perso => {
			let name = document.createElement('h5');
			name.innerHTML = perso.name
			resultDiv.appendChild(name);
		});
	}
}

fetch('http://localhost:8000/project/all')
	.then(data => data.json())
	.then(data => {
		console.log(data);
	})

//fetchAppend = (slug) => {
	//fetch('https://swapi.co/api/'+slug+'/?page=3')
	//.then(data => data.json())
	//.then(data => {
		//let table = new Table(slug, data.results);
		//table.render();
	//})
	//.catch(err => console.log(err));
// }
//const slugs = ['people', 'planets', 'starships'];
//slugs.forEach(slug => fetchAppend(slug));