import {bindable} from 'aurelia-framework';
import {Star} from "./star";

export class StarForeground {
  @bindable density = 50;
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  skyColor = "#0a0019";
  starColor = "white";

  maxStarSize = 2;
  minStarSize = 0.2;

  // higher is slower
  starSpeed = 2.7;

  attached() {
    this.sky = document.getElementById("star-foreground");
    const canvas = this.addCanvas(this.sky);
    this.context = canvas.getContext("2d");

    document.addEventListener('mousemove', this.setMousePos.bind(this));
    document.addEventListener('touchmove', this.setTouchPos.bind(this));

    this.stars = this.initStars();

    this.update();
  }

  update() {
    this.updateStars();

    this.drawSky();
    this.drawStars();

    window.requestAnimationFrame(this.update.bind(this));
  }

  updateStars() {
    this.stars.forEach(star => {
      star.y -= star.getSpeed();
      if (star.y < 0) {
        star.y = this.canvasHeight;
        star.x = this.getRandomStarX();
      }

      // star.setMouseDistance(this.mouseX, this.mouseY);
    });
  }

  drawSky() {
    this.context.fillStyle = this.skyColor;
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawStars() {
    this.stars.forEach(star => {
      star.setMouseDistance(this.mouseX, this.mouseY);

      this.context.fillStyle = this.starColor;

      this.context.beginPath();
      this.context.arc(star.getX(), star.getY(), star.size, 0, 2 * Math.PI);
      this.drawStar(star.getX(), star.getY(), 8, star.size, star.size / 2);
      this.context.fill();
    });
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.context.beginPath();
    this.context.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.context.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.context.lineTo(x, y)
      rot += step
    }
    this.context.lineTo(cx, cy - outerRadius);
    this.context.closePath();
    this.context.lineWidth = 0.1;
    this.context.strokeStyle = 'blue';
    this.context.stroke();
    this.context.fillStyle = 'skyblue';
    this.context.fill();
  }

  addCanvas(element) {
    let canvas = document.createElement('canvas');
    canvas.id = "CursorLayer";
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    element.appendChild(canvas);
    return canvas;
  }

  initStars() {
    let stars = [];
    for (let i = 0; i < this.density; i++) {
      let size = this.getRandomStarSize();
      stars.push(new Star(this.getRandomStarX(), this.getRandomStarY(), this.getStarSpeed(size), size));
    }
    return stars;
  }

  setMousePos(event) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  setTouchPos(event) {
    this.mouseX = event.changedTouches[0].clientX;
    this.mouseY = event.changedTouches[0].clientY;
  }

  getRandomStarX() {
    return Math.floor((Math.random() * this.canvasWidth) + 1);
  }

  getRandomStarY() {
    return Math.floor((Math.random() * this.canvasHeight) + 1);
  }

  getRandomStarSize() {
    return ((Math.random() * (this.maxStarSize - this.minStarSize)) + this.minStarSize);
  }

  getStarSpeed(size) {
    let base = (this.maxStarSize + this.minStarSize) - size;

    return base / this.starSpeed;
  }
}
