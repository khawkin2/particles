const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
document.body.appendChild(canvas); 

let particlesArray = [];
anim();

function generateParticles(amount) {
  let startingParticleCount = particlesArray.length;
  for (let i = 0; i < amount; i++) {
    particlesArray[i+startingParticleCount] = new Particle(
      generatePerimeterPoint(innerWidth, innerHeight),
      generateSize(),
      generateColor(),
      generateAngle(),
      generateSpeed()
    );
  }
}

function generatePerimeterPoint(width, height){
  var randomPoint = Math.random() * (width * 2 + height * 2);
  if (randomPoint > 0 && randomPoint < height){
      return {
          x: 0,
          y: height - randomPoint
      }
  }
  else if (randomPoint > height && randomPoint < (height + width)){
      return {
          x: randomPoint - height,
          y: 0
      }
  }
  else if (randomPoint > (height + width) && randomPoint < (height * 2 + width)){
      return {
          x: width,
          y: randomPoint - (width + height)
      }
  }
  else {
      return {
          x: width - (randomPoint - (height * 2 + width)),
          y: height
      }
  }    
}

function generateSize(){
  return (Math.random() * 10) + 15;
}

function generateColor() {
  let hexSet = "0123456789ABCDEF";
  let finalHexString = "#";
  for (let i = 0; i < 6; i++) {
    finalHexString += hexSet[Math.ceil(Math.random() * 15)];
  }
  return finalHexString;
}

function generateAngle() {
  return Math.random() * Math.PI * 2;
}

function generateSpeed() {
  return (Math.random() * 0.25) + 0.1;
}

function setSize() {
  canvas.height = innerHeight;
  canvas.width = innerWidth;
}

function removeParticle(particle, array){
  var index = array.indexOf(particle);
  array.splice(index, 1);
}

function Particle(startPosition, particleRadius, particleColor, angle, speed) {
  this.x = startPosition.x;
  this.y = startPosition.y;
  this.radius = particleRadius;
  this.color = particleColor;
  this.angle = angle;
  this.speed = speed;

  this.draw = () => {
    // Calculate old position
    const lastPosition = {
      x: this.x,
      y: this.y
    };

    // Calculate new position
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if (this.x >= innerWidth || this.y >= innerHeight || this.x <= 0 || this.y <= 0){
      removeParticle(this, particlesArray);
    } else {
      // Draw
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      context.moveTo(lastPosition.x, lastPosition.y);
      context.lineTo(this.x, this.y);
      context.closePath();
      context.fill();
    }
  };
}

function anim() {
  requestAnimationFrame(anim);

  context.fillStyle = "#101010";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#FF0000";
  particlesArray.forEach((particle) => particle.draw());
}

//On Load 
var start = document.getElementById('start-particles').onclick = function() {particleAsync('false')};
var stop = document.getElementById('stop-particles').onclick = function() {particleAsync('true')};
window.onload();

function onload(){
  canvas.style.zIndex = -1;
  canvas.style.position = 'relative';
  setSize();
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

//async Function
async function particleAsync(stop) {
  if(stop === 'true'){
    this.abort = true;
    particlesArray = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  while(stop !== 'true') {
    if (self.abort) {
      self.abort = false;
      return;
    }
    generateParticles(1);
    setSize();
    anim();
    await delay(100);
  }
}

