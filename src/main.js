//###############################################################################
//
// BLUEMOON - INDIE GAME DEV WEBSITE
//
// Author: Luca Mastroianni || BlueMoon
// LICENSE: Attribution-NonCommercial 4.0 International
//
// Additionally:
// -- All copyrighted material used inside this website are granted to the 
// respective trademark holder (SQUARE ENIX LTD). Any of the assets or reference
// will be used only for education or showcasing purposes without any kind 
// of commercial use instead.
//
//###############################################################################

(function() {

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight
});

/*window.addEventListener('resize', () => {
	app.renderer.resize(Math.min(SOURCE_WIDTH, window.innerWidth), Math.min(SOURCE_HEIGHT,window.innerHeight));
}, false)*/

//###############################################################################
//
// CONSTANTS
//
//###############################################################################

const STAGE = app.stage;
const TICKER = app.ticker;
const LOADER = PIXI.Loader.shared;
const ASSETS_FOLDER = "./assets/";

function parseTexture(token) {
	return LOADER.resources[token].texture.clone();
}

function screenWidth() {
	return app.renderer.width;
}

function screenHeight() {
	return app.renderer.height;
}

const CYAN = "#00e6e6"
const WHITE = "#ffffff"

//###############################################################################
//
// CONFIG
//
//###############################################################################

class Config {

	static mainWindowRect() {
		const rect = new PIXI.Rectangle();
		rect.width = Math.floor(screenWidth() / 1.8)
		rect.height = Math.floor(screenHeight() / 1.16);
		rect.x = screenWidth()/2 - rect.width / 2
		rect.y = screenHeight()/2 - rect.height / 2
		return rect
	}

	static locationWindowRect() {
		const rect = new PIXI.Rectangle();
		rect.width = Math.floor(screenWidth() / 3.8)
		rect.height = Math.floor(screenHeight() / 10);
		rect.x = Math.floor(screenWidth() - rect.width*1.6)
		rect.y = Math.floor(screenHeight() - rect.height)
		return rect
	}

	static infoWindowRect() {
		let locWindowRect = this.locationWindowRect()
		const rect = new PIXI.Rectangle();
		rect.width = Math.floor(screenWidth() / 6)
		rect.height = Math.floor(screenHeight() / 7.5);
		rect.x = Math.floor(locWindowRect.x + locWindowRect.width/2 - rect.width/5 - 2)
		rect.y = Math.floor(screenHeight() - rect.height - locWindowRect.height)
		return rect
	}

	static commandWindowRect() {
		const rect = new PIXI.Rectangle();
		rect.width = Math.floor(screenWidth() / 6.5);
		rect.height = Math.floor(screenHeight() / 1.58);
		rect.x = screenWidth() - rect.width*2; 
		rect.y = 0;
		return rect;
	}

	static websiteCommands() {
		return ["Games", "Projects", "Articles", "News", "About Me", "TEMPLATE", "TEMPLATE", "TEMPLATE", " ", "Save", "Quit"]
	}

}


//###############################################################################
//
// WINDOW
//
//###############################################################################

Base_Window = class extends PIXI.Container {

	constructor(rect) {
		super()
		this.init(rect)
		this.makeFrame(rect);
		this.draw();
	}

	get padding() {
		return 4;
	}

	get lineHeight() {
		return 38
	}

	init(rect) {
		this._width = rect.width;
		this._height = rect.height;
	}

	makeFrame(rect) {
		this._background = new PIXI.Sprite(parseTexture("texture"));
		//for(let i = 0; i < 8; i++) {this._background.addChild(new PIXI.Sprite(parseTexture("texture")))}
		this._foreground = new PIXI.Container();
		for(let i = 0; i < 8; i++) {this._foreground.addChild(new PIXI.Sprite(parseTexture("frame")))}
		this.makeRectGeometry(
			this._foreground,
			new PIXI.Rectangle(0,0,96,96),
			new PIXI.Rectangle(0,0,this._width,this._height),
			24
		)
		this._background.width = this._width - this.padding;
		this._background.height = this._height - this.padding;
		this._background.position.set(this.padding, this.padding)
		this.addChild(this._background);
		this.addChild(this._foreground);
		this.position.set(rect.x, rect.y);
		this._textContainer = new PIXI.Container();
		this.addChild(this._textContainer);
	}

	drawText(text,x,y,size = 48, color = "white", weight="") {
		let style = {
			fontFamily: "Reactor7",
			fontSize: size,
			fill: color,
			fontWeight: weight,
			padding: 100,
			dropShadow:true,
			dropShadowColor:"#000000",
			dropShadowDistance:4,
			dropShadowBlur:1
		}
		let tt = new PIXI.Text(text, style);
		tt.position.set(x,y);
		this._textContainer.addChild(tt);
	}

	getText(id) {
		return this._textContainer.children[id];
	}

	disposeText(id) {
		let text = this.getText(id);
		return this._textContainer.removeChild(text);
	}

	makeRectGeometry(sprite,source,destination,margin) {
	    const sx = source.x;
	    const sy = source.y;
	    const sw = source.width;
	    const sh = source.height;
	    const dx = destination.x;
	    const dy = destination.y;
	    const dw = destination.width;
	    const dh = destination.height;
	    const smw = sw - margin * 2;
	    const smh = sh - margin * 2;
	    const dmw = dw - margin * 2;
	    const dmh = dh - margin * 2;
	    const children = sprite.children;
	    //sprite.texture.frame = new PIXI.Rectangle(0, 0, dw, dh);
	    sprite.position.set(dx, dy);
	    // corner
	    children[0].texture.frame = new PIXI.Rectangle(sx, sy, margin, margin);
	    children[1].texture.frame = new PIXI.Rectangle(sx + sw - margin, sy, margin, margin);
	    children[2].texture.frame = new PIXI.Rectangle(sx, sy + sw - margin, margin, margin);
	    children[3].texture.frame = new PIXI.Rectangle(sx + sw - margin, sy + sw - margin, margin, margin);
	    children[0].position.set(0, 0);
	    children[1].position.set(dw - margin, 0);
	    children[2].position.set(0, dh - margin);
	    children[3].position.set(dw - margin, dh - margin);
	    // edge
	    children[4].position.set(margin, 0);
	    children[5].position.set(margin, dh - margin);
	    children[6].position.set(0, margin);
	    children[7].position.set(dw - margin, margin);
	    children[4].texture.frame = new PIXI.Rectangle(sx + margin, sy, smw, margin);
	    children[5].texture.frame = new PIXI.Rectangle(sx + margin, sy + sw - margin, smw, margin);
	    children[6].texture.frame = new PIXI.Rectangle(sx, sy + margin, margin, smh);
	    children[7].texture.frame = new PIXI.Rectangle(sx + sw - margin, sy + margin, margin, smh);
	    children[4].scale.x = dmw / smw;
	    children[5].scale.x = dmw / smw;
	    children[6].scale.y = dmh / smh;
	    children[7].scale.y = dmh / smh;
	    // center
	    if (children[8]) {
	        children[8].texture.frame = new PIXI.Rectangle(sx + margin, sy + margin, smw, smh);
	        children[8].position.set(margin, margin);
	        children[8].scale.x = dmw / smw;
	        children[8].scale.y = dmh / smh;
	    }
	    for (const child of children) {
	        child.visible = dw > 0 && dh > 0;
	    }		
	}

	draw() {
		// To be changed in child
	}
}

//###############################################################################
//
// LCCATION WINDOW
//
//###############################################################################

class Location extends Base_Window {
	draw() {
		this.drawText("Somewhere in Italy", 30,0)
		let text = this.getText(0)
		text.anchor.set(0,0.5)
		text.y = this._height / 2
	}
}

//###############################################################################
//
// LCCATION WINDOW
//
//###############################################################################

class Info extends Base_Window {
	draw() {
		this.drawText("Time", 30,15)
		let timeText = this.getText(0)
		this.drawText("Gil", 30, timeText.y + this.lineHeight)
		this.drawText("", this._width - 30, timeText.y,48,"white","bold")
		this.drawText("Donate $", this._width - 20, timeText.y + this.lineHeight, 48, CYAN)
		let tt = this.getText(3);
		tt.x -= tt.width

		tt.interactive = true;
		tt.on("pointerdown", () => window.open("https://www.paypal.com/paypalme/GamefallTeamPlugins/1usd", "_blank"))
	}

	update() {
		let date = new Date().toLocaleTimeString()
		let tt = this.getText(2);
		tt.text = date;
		tt.x = this._width - 20 - tt.width
	}
}

//###############################################################################
//
// STATUS
//
//###############################################################################

class Status extends Base_Window {
	static PARTY_DATA = [
		["Luca", "LV", "HP", "MP", "1996-07-25", "665/  800", "121/  121"],
		["Anna", "LV", "HP", "MP", "1996-11-13", "665/  800", "121/  121"],
		["Ivano", "LV", "HP", "MP", "1995-07-06", "665/  800", "121/  121"],
	]
	
	draw() {
		this._mugshots = [];
		for(let i = 0; i < 3; i++) {
			const mugshot = new PIXI.Sprite(parseTexture("mugshot"))
			const data = Status.PARTY_DATA[i]
			this.addChild(mugshot);
			mugshot.scale.set(2)
			mugshot.position.set(58,38 + ((this.lineHeight * 3) + 130) * i)
			let fontSize = 42;
			this.drawText(data[0], mugshot.x + mugshot.width + 78, mugshot.y)
			this.drawText(data[1], mugshot.x + mugshot.width + 78, mugshot.y + this.lineHeight, fontSize, CYAN,"bold")
			this.drawText(data[2], mugshot.x + mugshot.width + 78, mugshot.y + this.lineHeight*2, fontSize, CYAN,"bold")
			this.drawText(data[3], mugshot.x + mugshot.width + 78, mugshot.y + this.lineHeight*3, fontSize, CYAN,"bold")
	
			const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
	
			let myAge = getAge(data[4]);
			this.drawText(myAge, mugshot.x + mugshot.width + 140, mugshot.y + this.lineHeight, fontSize, WHITE,"bold")
	
			this.drawStatusBars(mugshot, fontSize, data);

			this._mugshots.push(mugshot)
		}

	}

	drawStatusBars(mugshot, fontSize, data) {
		this._graphics = new PIXI.Graphics();
		this.addChild(this._graphics)

		let gw = Math.floor(this._width / 5)
		this.drawText(data[5], mugshot.x + mugshot.width + 78 + Math.floor(gw/2.1) + 5, (mugshot.y + this.lineHeight * 2) - 4, fontSize)
		this._graphics.beginFill(0x000000);
		let hpText = this.getText(5);
		hpText.style.fontWeight = "bold"
		this._graphics.drawRect(mugshot.x + mugshot.width + 78 + gw/4 + 5, (mugshot.y + this.lineHeight * 3) - 3, gw, 6);
		this._graphics.endFill();

		this.drawText(data[6], mugshot.x + mugshot.width + 78 + Math.floor(gw/2.1) + 5, (mugshot.y + this.lineHeight * 3) - 4, fontSize)
		this._graphics.beginFill(0x000000);
		let mpText = this.getText(6);
		mpText.style.fontWeight = "bold"
		this._graphics.drawRect(mugshot.x + mugshot.width + 78 + gw/4 + 5, (mugshot.y + this.lineHeight * 4) - 3, gw, 6);
		this._graphics.endFill();
	}
}

//###############################################################################
//
// COMMAND WINDOW
//
//###############################################################################

class Command extends Base_Window {

	draw() {
		const commands = Config.websiteCommands();
		let startY = 20;
		let startX = 55;
		for(let i = 0; i < commands.length; i++) {
			let command = commands[i]
			this.drawText(command, startX, startY + ((this.lineHeight + 12) * i), 52)
		}

		this.createCursor();
	}

	createCursor() {
		const commands = Config.websiteCommands();
		this._cursor = new PIXI.Sprite(parseTexture("cursor"));
		this.addChild(this._cursor);
		this._cursor.position.set(this._cursorStartX, 20 + this._cursor.height / 4);
		this._cursor.scale.set(0.5);
		this._cursor.pivot.set(this._cursor.width,0)
		this._index = 0;

		document.addEventListener("keydown", (e) => {
			if(e.which === 40) { // Arrow Down
				this._index = (this._index + 1) % commands.length;
				this._cursor.y = (20 + this._cursor.height / 4) + (this.lineHeight * this._index)
			}
		})
	}
}

//###############################################################################
//
// ENTRY POINT
//
//###############################################################################

document.addEventListener("DOMContentLoaded",() => {
	document.body.appendChild(app.view)
    app.view.style.position = "absolute";
    app.view.style.margin = "auto";
    app.view.style.top = 0;
    app.view.style.left = 0;
    app.view.style.right = 0;
    app.view.style.bottom = 0;
    // LOADER
	LOADER.add("texture", ASSETS_FOLDER + "Texture.png");
	LOADER.add("frame", ASSETS_FOLDER + "Frame.png");
	LOADER.add("mugshot", ASSETS_FOLDER + "mugshot.png")
	LOADER.add("cursor", ASSETS_FOLDER + "Cursor.png")
	//=================================================
	LOADER.load(() => {
		window.testWin = new Status(Config.mainWindowRect())
		STAGE.addChild(window.testWin)

		let location = new Location(Config.locationWindowRect())
		STAGE.addChild(location)

		let info = new Info(Config.infoWindowRect())
		STAGE.addChild(info)

		TICKER.add(info.update, info)

		let command = new Command(Config.commandWindowRect())
		STAGE.addChild(command);

		let crtFilter = new PIXI.filters.CRTFilter();
		crtFilter.vignetting = 0;
		crtFilter.lineWidth = 1
		crtFilter.lineContrast = 0.3;
		STAGE.filters = [crtFilter]
	})
})

})()


/*
<footer>
	<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.
</footer>
*/