export default class App {
	constructor(name) {
		this.name = name || 'Webpack Boilerplate';
	}

	init() {
		console.log(this.name);
	}
}
