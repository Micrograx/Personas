var personas = []
var r;
var minP = Infinity
var debug;
var mr = 0.03
var plantas = []

function setup() {
  r = displayWidth / 100
  createCanvas(displayWidth , displayHeight - 20)

  for (var i = 0; i < 100; i++) {

    var x = floor(random(10, window.width))
    var y = floor(random(10, window.height))
    personas.push(new persona(x, y, r))

  }

  for (var i = 0; i < 15; i++) {

    var x = floor(random(10, window.width))
    var y = floor(random(10, window.height))
    plantas.push(new planta(x,y))

  }

  debug = createCheckbox()
}

function draw() {
  background(200)
  if (random() < 0.02) {
    crearPersona()

  }
  if (random() < 0.08) {
    var x = floor(random(10, window.width))
    var y = floor(random(10, window.height))
    plantas.push(new planta(x,y))
  }


  for (var i = personas.length - 1; i >= 0; i--) {
    // personas[i].seek(createVector(mouseX,mouseY))
    personas[i].behaviors(personas,plantas)
    personas[i].boundaries()
    personas[i].update()
    if (personas[i].combine() == false) {

      if (personas[i].pos.x > window.width || personas[i].pos.y > window.height || personas[i].pos.x < 0 || personas[i].pos.y < 0) {
        personas.splice(i, 1)
        crearPersona()
      } else personas[i].display()
    }



    if (personas.length < minP) minP = personas.length
  }

  for ( var i = 0; i < plantas.length;i++){
    plantas[i].display()
  }


}

function crearPersona() {

  var x = floor(random(10, window.width))
  var y = floor(random(10, window.height))
  var radioR = 0
  var dnaR = null
  var timeR = 0
  var pool = []
  for (var i = 0; i < personas.length; i++) {
    radioR = personas[i].radio
    timeR = personas[i].time
    for (var j = 0; j < radioR * 0.1; j++) {
      pool.push(personas[i].dna)
    }
    for (var j = 0; j < timeR * 0.01; j++) {
      pool.push(personas[i].dna)
    }
  }



  parentA = random(pool)
  parentB = random(pool)

  dnaR = crossOver(parentA, parentB)

  personas.push(new persona(x, y, r, dnaR))

}

function crossOver(listA, listB) {
  var nAdn = []

  for (var i = 0; i < listA.length; i++) {

    if (i % 2 == 0) {

      nAdn[i] = listA[i]
    } else {
      nAdn[i] = listB[i]
    }
  }
  return nAdn
}
