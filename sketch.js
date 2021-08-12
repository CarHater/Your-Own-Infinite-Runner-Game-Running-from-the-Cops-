var Boy,BoyRunning,BoyFallen,BoyJumpingSound;
var Police,PoliceRunning,PoliceHitting,PoliceHittingSound, PoliceShooting;
var GameBackground,GameBackgroundImage;
var scoreW;
var gameState;
var GameOver,GameOverImage, GameOverSound, GameOverSoundYes;
var beingBeaten;
var Restart,RestartImage;
var DogGroup,Dog,DogRunning,DogStanding,DogBarkingSound;

function preload(){

  BoyRunning = loadAnimation("Boy-Standing.png","Boy-Running-1.png","Boy-Running-2.png");
  BoyFallen = loadAnimation("Boy-Fallen.png");

  GameBackgroundImage = loadImage("Game-Background.jpg");

  PoliceRunning = loadAnimation("Police-Running-1.png","Police-Running-2.png");
  PoliceHitting = loadAnimation("Police-Bat-Down.png","Police-Bat-Up.png");
  PoliceShooting = loadImage("Police-Shooting.png");

  GameOverImage = loadImage("Game-Over.png");

  RestartImage = loadImage("Restart.png");

  BoyJumpingSound = loadSound("Jump-Sound-Effect.mp3");
  PoliceHittingSound = loadSound("Being-Beaten.mp3");
  GameOverSound = loadSound("Game-Over.mp3");

  DogRunning = loadAnimation("Dog-Running-1.png","Dog-Running-2.png");
  DogStanding = loadImage("Dog-Standing.png");

}

function setup() {
 
  createCanvas(480.375,360.75);

  score=0;
  gameState=1;
  beingBeaten=0;
  GameOverSoundYes=0;

  GameBackground = createSprite(480.375,180.375);
  GameBackground.addImage("GameBackground",GameBackgroundImage);
  GameBackground.scale=0.25;

  Boy = createSprite(200,250,0,0);
  Boy.addAnimation("Running",BoyRunning);
  Boy.addAnimation("Fallen",BoyFallen);

  Police = createSprite(50,238,0,0);
  Police.addAnimation("Running",PoliceRunning);
  Police.addAnimation("Hitting",PoliceHitting);
  Police.addImage("Shooting",PoliceShooting);

  GameOver = createSprite(240,120,0,0);
  GameOver.addImage("GameOver",GameOverImage);
  GameOver.scale=0.25;
  GameOver.visible=false;

  
  Restart = createSprite(240,200,0,0);
  Restart.addImage("Restart",RestartImage);
  Restart.scale = 0.4;

  DogGroup = createGroup();

}

function draw() {

  background(180);

  if(gameState==1){

    spawnDogs();

    Restart.visible=false;

    Boy.changeAnimation("Running",BoyRunning);

    score=score + Math.round(getFrameRate()/60);
    

    GameBackground.velocityX=-(2+score/50);

    if(GameBackground.x<0){
      GameBackground.x = 480.375;
    }
  
    if(Boy.y<250){
      Boy.velocityY = Boy.velocityY+0.5;
    }

    if(Boy.y>250){
      Boy.velocityY = 0;
      Boy.y=250;
    }

    if(keyDown(LEFT_ARROW)){
      Boy.x=Boy.x-(4+score/250);
    }

    if(keyDown(RIGHT_ARROW)){
      Boy.x=Boy.x+(4+score/250);
    }

    if(keyDown("space") && Boy.y==250){
      Boy.velocityY=-10;
      BoyJumpingSound.play();
    }

    if(Boy.isTouching(Police)){
        gameState=2;
        Police.changeAnimation("Hitting",PoliceHitting);
        Police.x=Police.x+30;
        beingBeaten=1;
        GameOverSoundYes=1;

    }  

    if(DogGroup.isTouching(Boy)){
        gameState=2;
        GameOverSoundYes=1;
        Police.changeAnimation("Shooting",PoliceShooting);
        Dog.addImage("Standing",DogStanding);
        Dog.changeAnimation("Standing",DogStanding);
        Dog.velocityX=0;
        Dog.y=Dog.y-3;

    }


  }

  if(gameState==2){
    //Coin.visible=false;
    Restart.visible=true;
    Boy.changeAnimation("Fallen",BoyFallen);
    Boy.y=270;
    GameBackground.velocityX=0;
    GameOver.visible=true;


    if(beingBeaten==1){
        PoliceHittingSound.play();
        PoliceHittingSound.loop();
        beingBeaten=0;
      }
      
    if(GameOverSoundYes==1){
      GameOverSound.play();
      GameOverSoundYes=0;
    }
    
    if(mousePressedOver(Restart)){
      reset();
    }

    }
  
  drawSprites();

  text("Score: " + score,375,50);
 
}

function spawnDogs(){

  if(frameCount%120==0){
    Dog = createSprite(480.375,260,0,0);
    Dog.scale=0.8;
    Dog.addAnimation("Running",DogRunning);
    Dog.changeAnimation("Running",DogRunning);
    Dog.velocityX = -(7+score/50);
    DogGroup.add(Dog);
  }
}

function reset(){

  score=0;
  Police.changeAnimation("Running",PoliceRunning);
  PoliceHittingSound.stop();
  Police.x=50;
  Police.y=238;
  GameOverSound.stop();
  GameOver.visible=false;
  Restart.visible=false;
  Boy.x=200;
  Boy.y=250;
  gameState=1;
  DogGroup.destroyEach();

}