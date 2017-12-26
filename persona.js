function persona(x, y, radio, dna) {

  if (random() < 0.3) {
    // Herbivoros
    this.feeding = 1
  } else {
    // Carnivoros
    this.feeding = 2
  }

  this.maxspeed;
  this.maxforce = 0.9;
  this.maxRadio = r * 20

  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D()
  this.pos = createVector(x, y);


  this.time = 0

  this.k = 100

  this.radio = radio

  this.blue = 0


  this.dna = [];
  if (dna === undefined) {
    // Smaller weight
    this.dna[0] = random(-3, 5);
    // Biger weight
    this.dna[1] = random(-3, 5)
    // Smaller constant
    this.dna[2] = random(0, window.width / 6);
    // Biger constant
    this.dna[3] = random(0, window.width / 6);
    // Smaller distance
    this.dna[4] = this.radio / 2 + this.dna[2]
    // Biger distance
    this.dna[5] = this.radio / 2 + this.dna[3]
  } else {
    // Mutation
    this.dna[0] = dna[0];
    if (random(1) < mr) {
      this.dna[0] += random(-0.5, 0.5);
    }
    this.dna[1] = dna[1];
    if (random(1) < mr) {
      this.dna[1] += random(-0.5, 0.5);
    }
    this.dna[2] = dna[2];
    if (random(1) < mr) {
      this.dna[2] += random(-window.width / 10 / 10, window.width / 10 / 10);
    }
    this.dna[3] = dna[3];
    if (random(1) < mr) {
      this.dna[3] += random(-window.width / 10 / 10, window.width / 10 / 10);
    }
    if (random(1) < mr * 4) {
      this.radio += random(0, 10)
    }
  }

  this.r = map(this.dna[0], -3, 5, 50, 255)
  this.g = map(this.dna[1], -3, 5, 50, 255)

  this.clone = function() {
    if (random(1) < 0.002) {
      crearPersona(this.dna)
    }
  }


  this.display = function() {
    if (this.feeding == 1) fill(0, this.g, 0)
    if (this.feeding == 2) fill(this.r, 0, 0)

    strokeWeight(1)
    ellipse(this.pos.x, this.pos.y, this.radio, this.radio)

    push();
    translate(this.pos.x, this.pos.y);
    if (debug.checked()) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      strokeWeight(2);
      ellipse(0, 0, this.dna[4] * 2);
      stroke(255, 0, 0);
      ellipse(0, 0, this.dna[5] * 2);
    }
    pop();

  }

  this.behaviors = function(carne, plantas) {
    var good = []
    var bad = []
    if (this.feeding == 2) {
      for (i = 0; i < carne.length; i++) {
        if (carne[i].radio + this.radio / 2 < this.maxRadio && this.radio > carne[i].radio) {
          good.push(carne[i])
        } else if (carne[i].radio + this.radio < this.maxRadio && this.radio < carne[i].radio) {
          bad.push(carne[i])
        }
      }
    } else {
      for (var i = 0; i < plantas.length; i++) {
        good.push(plantas[i])
      }
      for (var i = 0; i < carne.length; i++) {
        if (carne[i].radio + this.radio < this.maxRadio && this.radio < carne[i].radio) {
          bad.push(carne[i])
        }
      }
    }


    var steerG = this.eat(good, this.dna[4]);
    var steerB = this.eat(bad, this.dna[5]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }


  this.eat = function(list, perception) {

    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {

      var d = dist(this.pos.x, this.pos.y, list[i].pos.x, list[i].pos.y)

      if (d < this.maxspeed) {
        list.splice(i, 1);
      } else {

        if (d < record && d < perception) {

          record = d;
          closest = list[i].pos;
        }
      }
    }

    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  this.update = function() {

    this.dna[4] = this.radio / 2 + this.dna[2]
    this.dna[5] = this.radio / 2 + this.dna[3]

    if (this.radio > 10) this.radio -= (this.radio * 0.002)
    if (this.radio < 10) this.radio -= 0.5
    if (this.radio < 0) this.radio = 0
    this.time += 1
    this.maxspeed = this.k / this.radio
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.pos.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);


  }

  this.combine = function() {
    if (this.feeding == 2) {
      for (var i = personas.length - 1; i >= 0; i--) {
        record = dist(this.pos.x, this.pos.y, personas[i].pos.x, personas[i].pos.y)
        if (record <= this.radio / 2 && record > 0 && (this.radio + personas[i].radio / 2) <= this.maxRadio && this.radio >= personas[i].radio) {
          this.radio = this.radio + personas[i].radio / 2
          personas.splice(i, 1)
          if (random() < 0.3) {
            crearPersona()
          }
          return true
        }
      }
      return false
    } else {
      for (var i = plantas.length - 1; i >= 0; i--) {
        record = dist(this.pos.x, this.pos.y, plantas[i].pos.x, plantas[i].pos.y)
        if (record <= this.radio / 2 && record > 0 && (this.radio + plantas[i].size * 0.6) <= this.maxRadio) {
          this.radio = this.radio + plantas[i].size * 0.6
          plantas.splice(i, 1)
          return true
        }
      }
      return false
    }

  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  this.seek = function(target) {

    var desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    return steer;
    //this.applyForce(steer);
  }

  this.boundaries = function() {
    var d = 25;

    var desired = null;

    if (this.pos.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.pos.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.pos.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.pos.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }
}
