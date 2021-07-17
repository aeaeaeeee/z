var play = 1;
var over = 0;
var gamestate = play;

var dino, run, collided;
var ground, invisible, groundimg;

var cloudgroup, cloudImage;
var obstaclegroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var backImg; 

var score;

var end, endimg, restart, reimg;
var jumpsound, checkpointsound, diesound;


function preload() {
  run = loadAnimation("assets/trex_1.png", "assets/trex_2.png", "assets/trex_3.png");
  collided = loadAnimation("assets/trex_collided.png");

  cloudImage = loadImage("assets/cloud.png");
  backImg = loadImage("assets/backgroundImg.png");
  sunAnimation = loadImage("assets/sun.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  
  endimg = loadImage("assets/gameOver.png");
  reimg = loadImage("assets/restart.png");
  
  jumpsound = loadSound("assets/sounds/jump.wav");
  diesound = loadSound("assets/sounds/collided.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 sun = createSprite(width-50, 100, 10, 10);
 sun.addAnimation("sun", sunAnimation);
 sun.scale = 0.1;

  dino = createSprite(50, height-70, 20, 50);
  dino.addAnimation("running", run);
  dino.addAnimation("collided", collided);
  dino.setCollider("circle", 0, 0, 350);
  dino.scale = 0.08;
  dino.velocityX = 4;

  invisible = createSprite(width/2, height-10, width, 125);
  invisible.shapeColor = "red";

  ground = createSprite(width/2, height, width, 2);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3* score/100);

  end = createSprite(width/2, height/2- 50);
  end.addImage(endimg);
  
  restart = createSprite(width/2, height/2);
  restart.addImage(reimg);
  
  end.scale = 0.5;
  restart.scale = 0.1;
  
  end.visible = false;
  restart.visible = false;

  obstaclegroup = new Group();
  cloudgroup = new Group();

  score = 0;
  window.focus();
}

function draw() {
  background(backImg);
  textSize(20);
  fill("black");
  text("Score: " + score, windowWidth/2 + camera.position.x - 200, 50);

  if (gamestate === play) {
    camera.position.x = dino.x;

    if(camera.position.x + width/2 > ground.x + ground.width/2)
    {
   ground.x = camera.position.x;
   invisible.x = camera.position.x;
    }

    score = score + Math.round(getFrameRate()/60);

    if ((touches.length > 0 || keyDown("SPACE")) && dino.y >= height-120) {
      dino.velocityY = -11.5;
      jumpsound.play();
      touches = [];
    }

    dino.velocityY = dino.velocityY + 0.8;
    
     dino.collide(invisible);
    spawnobstacles();
    spawnclouds();

    if (obstaclegroup.isTouching(dino)) {
      gamestate = over;
      diesound.play();
    }
  } 
   else if (gamestate === over) {
     end.visible = true;
     restart.visible = true;
    ground.velocityX = 0;
    dino.velocityX = 0;
    
    dino.changeAnimation("collided", collided);
    
    obstaclegroup.setLifetimeEach(-1);
    cloudgroup.setLifetimeEach(-1);
    
    obstaclegroup.setVelocityXEach(0);
    cloudgroup.setVelocityXEach(0);
    
    if(touches.length > 0 || keyDown("SPACE"))
     {
       reset();
       touches = [];
    }
  }

  drawSprites();
}

function reset()
{
  gamestate = play;
  
  end.visible = false;
  restart.visible = false;

  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  
  dino.changeAnimation("running", run);
  
  score = 0;
}

function spawnobstacles() {
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(camera.position.x + windowWidth/2, height-95, 20, 30);
    obstacle.velocityX = -(6 + 3* score/100);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      default: break;
    }

    obstacle.scale = 0.3;
    obstacle.lifetime = 90;
    obstacle.depth = dino.depth;
    dino.depth +=1;
    obstaclegroup.add(obstacle);
  }
}


function spawnclouds() {
  if (frameCount % 100 === 0) {
    cloud = createSprite(camera.position.x + windowWidth/2, height-300, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(100, 220))
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 1000;

    cloud.depth = dino.depth;
    dino.depth = dino.depth + 1;
    cloudgroup.add(cloud);
  }
}