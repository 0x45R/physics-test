mainCanvas.resizeCanvas = () => {
	const {width, height} = mainCanvas.getBoundingClientRect()
	mainCanvas.width = width
	mainCanvas.height = height
}

const AIR_RESISTANCE = 0.2
const RANDOMNESS = 15

window.onresize = mainCanvas.resizeCanvas
window.onload = mainCanvas.resizeCanvas
mainCanvas.ctx = mainCanvas.getContext('2d')

class Circle{
	constructor(position = new Vector(0,0), velocity = new Vector(0,0),radius = 1){
		this.oldPosition = new Vector(0,0)
		this.position = position
		this.velocity = velocity
		this.radius = radius
	}
	collideWith(object, {width}, reverse = false){
		this.calculatedSize = this.radius * width
		object.calculatedSize = object.radius * width
		let a = this.calculatedSize + (object.calculatedSize-this.calculatedSize*2);
		let x = this.position.x - object.position.x;
		let y = this.position.y - object.position.y;
		let colliding =( reverse ? 1 : -1) *  a < ( reverse ? 1 : -1) * Math.sqrt((x * x) + (y * y))
		//console.log(a, x, y, colliding)
		if(colliding){
			this.position = this.oldPosition.copy()
			this.velocity.multiply(new Vector(-1,-1))
	
			//const randomVelocity = new Vector(5,5).multiply(Vector.random())
	
			//this.velocity.add( new Vector(RANDOMNESS,RANDOMNESS).multiply(Vector.random()))
			//
			// Fake air
			this.velocity.multiply(new Vector(1-AIR_RESISTANCE,1-AIR_RESISTANCE))
		}
	
		//this.position = object.position
	}
	applyVelocity(){
		this.oldPosition = this.position.copy()
		this.position.add(this.velocity)
		//this.velocity.multiply(new Vector(0.9,0.9))
	}
}

class BoundaryCircle extends Circle{
	constructor(){
		super(new Vector(0,0), new Vector(0,0),0.25)
	}
	draw({ctx, height, width}){
		ctx.beginPath();
		ctx.arc(width/2-this.position.x,height/2-this.position.y,this.radius*width,0,2*Math.PI,false);
		ctx.strokeStyle = 'crimson';
		ctx.lineWidth = width*0.01
		ctx.stroke();
	}

}
class Vector{
	static random(){
		return new Vector(Math.random()-0.5, Math.random()-0.5)
	}
	constructor(x,y){
		this.x = x;
		this.y = y;
		return this;
	}
	substract(vector){
		this.x -= vector.x;
		this.y -= vector.y;
		return this;
	}
	add(vector){
		this.x += vector.x;
		this.y += vector.y;
		return this;
	}
	multiply(vector){
		this.x *= vector.x;
		this.y *= vector.y;
		return this
	}
	multiplyByNumber(number){
		this.x *= number;
		this.y *= number;
		return this
	}
	copy(){
		return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
	}
}
class Ball extends Circle{
	constructor(){
		const random = Vector.random()
		random.multiplyByNumber(RANDOMNESS)
		const position = Vector.random().multiplyByNumber(30)
		super(position, random, 0.025)
	}
	draw({ctx, height, width}){
		this.velocity.y -= 0.1
		ctx.beginPath();
		ctx.arc(width/2-this.position.x,height/2-this.position.y,this.radius*width,0,2*Math.PI,false);
		ctx.fillStyle = 'white';
		ctx.fill();
	}
}
mainCanvas.boundary = new BoundaryCircle()
mainCanvas.objects = []

for(i = 0; i<10; i++){
	mainCanvas.objects.push(new Ball())
}
mainCanvas.draw = () => {
	const {ctx, height, width} = mainCanvas
	ctx.reset()
	mainCanvas.objects.forEach(object => object.applyVelocity())
	mainCanvas.objects.forEach(object => {
		mainCanvas.objects.forEach(nested=>{
			object.collideWith(nested,mainCanvas)
		})
		object.collideWith(mainCanvas.boundary,mainCanvas,true)
	})

	mainCanvas.boundary.draw(mainCanvas)
	mainCanvas.objects.forEach(value => value.draw(mainCanvas))
	

	
}
mainCanvas.drawInterval = setInterval(mainCanvas.draw, 1)
