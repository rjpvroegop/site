export class Star {
  constructor(x = 0, y = 0, speed = 1, size = 1) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  setMouseDistance(mousex = 0, mousey = 0) {
    let distanceX = this.x - mousex;
    this.positionX = this.x + distanceX;

    let distanceY = this.y - mousey;
    this.positionY = this.y + distanceY;
  }

  getX() {
    return this.positionX;
  }

  getY() {
    return this.positionY;
  }

  getSize() {
    return this.size;
  }

  getSpeed() {
    return this.speed;
  }
}
