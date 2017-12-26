function planta(x, y) {

  this.pos = createVector(x, y)
  this.size = floor(random(10, 30))

  this.display = function() {
    push()
    fill(0, 230, 0)
    stroke(0,180,0)
    strokeWeight(2)
    rect(this.pos.x, this.pos.y, this.size,this.size)
    pop()
  }

}
