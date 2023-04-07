let trex, trex_running, trex_collided;

let ground, invisibleGround, groundImage;

let cloud, cloudImg;

let cacto, cactoImg1, cactoImg2, cactoImg3, cactoImg4, cactoImg5, cactoImg6;

let score = 0;
let play = 1;
let end = 0;

let gameState = play;

let cactoGp, cloudGp;

let gameOver, GameOverImg;

let restart, restartImg;

let jump, point, die;

let record = 0;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  cloudImg = loadImage("cloud.png");
  groundImage = loadImage("ground2.png");
  cactoImg1 = loadImage("obstacle1.png");
  cactoImg2 = loadImage("obstacle2.png");
  cactoImg3 = loadImage("obstacle3.png");
  cactoImg4 = loadImage("obstacle4.png");
  cactoImg5 = loadImage("obstacle5.png");
  cactoImg6 = loadImage("obstacle6.png");
  GameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  point = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //crie um sprite de trex
  trex = createSprite(50, height - 20, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 30);

  //crie um sprite ground (solo)
  ground = createSprite(width / 2, height - 30, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //crie um solo invisível
  invisibleGround = createSprite(width / 2, height - 10, width, 2);
  invisibleGround.visible = false;

  cactoGp = createGroup();
  cloudGp = createGroup();
  gameOver = createSprite(width / 2, height - 120, 100, 10);
  gameOver.addImage(GameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(width / 2, height - 90, 100, 10);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  //definir cor de fundo
  background("white");
  // Comando para verificar se o trex tocou no cacto
  if (cactoGp.isTouching(trex)) {
    gameState = end;
    //Barulho de morrer
    // die.play()
  }

  if (gameState === play) {
    ground.velocityX = -(6 + (3 * score) / 100);
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //pular quando tecla espaço for pressionada
    if (touches.length > 0 || (keyDown("space") && trex.y >= height - 40)) {
      trex.velocityY = -12;
      jump.play();
      touches = [];
    }
    CreateCactos();
    createClouds();
    score = score + Math.round(getFrameRate() / 60);
    if (score % 100 === 0 && score > 0) {
      point.play();
    }
  }

  if (gameState === end) {
    trex.changeAnimation("collided", trex_collided);
    ground.velocityX = 0;
    cactoGp.setVelocityXEach(0);
    cloudGp.setVelocityXEach(0);
    cactoGp.setLifetimeEach(-1);
    cloudGp.setLifetimeEach(-1);
    gameOver.visible = true;
    restart.visible = true;
    if (record < score) {
      record = score;
    }

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  //adicionar gravidade
  trex.velocityY = trex.velocityY + 0.8;

  //impedir que o trex caia
  trex.collide(invisibleGround);

  textSize(15);
  text("score" + score, width - 100, height - 150);
  text("record" + record, width - 250, height - 150);
  drawSprites();
}

function createClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, random(height - 186, height - 100), 40, 10);
    cloud.velocityX = -(4 + score / 100);
    cloud.addImage(cloudImg);
    cloud.scale = random(0.4, 1.2);
    cloud.depth = trex.depth - 1;
    cloud.lifetime = 220;
    cloudGp.add(cloud);
  }
}

function CreateCactos() {
  if (frameCount % 80 === 0) {
    cacto = createSprite(width, height - 30, 40, 10);
    cacto.velocityX = -(4 + score / 100);
    cacto.lifetime = 300;
    cactoGp.add(cacto);
    cacto.depth = trex.depth;
    cacto.scale = 0.4;
    let sorteio = Math.round(random(1, 6));
    switch (sorteio) {
      case 1:
        cacto.addImage(cactoImg1);
        break;

      case 2:
        cacto.addImage(cactoImg2);
        break;

      case 3:
        cacto.addImage(cactoImg3);
        break;

      case 4:
        cacto.addImage(cactoImg4);
        break;

      case 5:
        cacto.addImage(cactoImg5);
        break;

      case 6:
        cacto.addImage(cactoImg6);
        break;
    }
  }
}

function reset() {
  gameState = play;
  gameOver.visible = false;
  restart.visible = false;
  cactoGp.destroyEach();
  cloudGp.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}
