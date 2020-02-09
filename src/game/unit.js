import skull from '../public/images/characterSprites/Skull.png';
const DIRECTION = {
	40: 0,
	37: 1,
	39: 2,
	38: 3
}
const DUREE_ANIMATION = 3;
const DUREE_DEPLACEMENT = 9;

export class Unit {
	constructor(x, y, direction) {
		this.eventPile = new Array();
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.src = skull;
		this.etatAnimation = -1;
		this.image = new Image();
		this.image.src = this.src
		this.image.ref = this;
		this.image.onload = function() {
			if(!this.complete) throw "Erreur de chargement du sprite Character";
			this.ref.width = this.width / 3;
			this.ref.height = this.height / 4;
		};
	}

	draw(context, callback) {
		if (this.x === -1) return callback(false);
		let frame = 1; // Numéro de l'image à prendre pour l'animation
		let decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
		if (this.etatAnimation >= DUREE_DEPLACEMENT) {
			this.etatAnimation = -1;
			clearInterval(this.animation);
			callback(true);
		}
    	else if(this.etatAnimation >= 0) {
		// On calcule l'image (frame) de l'animation à afficher
			frame = Math.floor(this.etatAnimation / DUREE_ANIMATION);
			if(frame > 2) frame %= 3;
		// Nombre de pixels restant à parcourir entre les deux cases
			var pixelsAParcourir = 32 - (32 * (this.etatAnimation / DUREE_DEPLACEMENT));
		// À partir de ce nombre, on définit le décalage en x et y.
		// NOTE : Si vous connaissez une manière plus élégante que ces quatre conditions, je suis preneur
			if(this.direction === 3) decalageY = pixelsAParcourir;//haut?
			else if(this.direction === 0) decalageY = -pixelsAParcourir;//bas?
			else if(this.direction === 1) decalageX = pixelsAParcourir;//gauche?
	 		else if(this.direction === 2) decalageX = -pixelsAParcourir;//droite?
	 		this.etatAnimation++
		}
 // * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
 // * donc il nous suffit de garder les valeurs 0 pour les variables 
 // * frame, decalageX et decalageY
 		context.drawImage(
			this.image,
			frame*this.width, this.direction*this.height,
			this.width, this.height,
			(this.x * 32) + decalageX, ((this.y * 32) - 8) + decalageY,
			this.width, this.height,
		);
	}
}