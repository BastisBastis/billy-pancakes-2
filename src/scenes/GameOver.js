import Phaser from "phaser"
import Levels from "../assets/data/Levels"
import EventCenter from "../helpers/EventCenter"
import ScoreManager from "../helpers/ScoreManager"



export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameover")
  }
  
  preload() {
    this.load.rexWebFont({
      google: {
        families: ['Acme']
      },
    });
    this.load.on('webfontactive', function (fileObj, familyName) {
      //console.log('font-active: ' + familyName)
    });
    this.load.on('webfontinactive', function (fileObj, familyName) {
      //console.log('font-inactive: ' + familyName)
    })
  }
  
  create(data) {
    try {
    console.log("in create: data: ",data)
    if (data.levelIndex===0) {
      ScoreManager.health=0;
      ScoreManager.carrots=0;
    }
    
    //cam.setBackgroundColor("#9090aa")
    this.scene.launch("demo")
    this.scene.sendToBack("demo")
    
    
    if (data.win  && data.levelIndex>= Levels.length-1) {
      this.setupGameFinished(data)
    } else {
      this.setupGameNotFinished(data)
    }
    
    } catch (er) {console.log(er)}
  }
  
  setupGameFinished(data) {
    
    ScoreManager.score+=data.score;
      ScoreManager.health+=data.health;
      ScoreManager.carrots+=data.carrots
    
    const string=`You did it! You helped Billy Pancakes get rid of all the Rabid Carrot Munchers in the entire warehouse!

Billy will take a day off from work to recover from the rabies. When he return his boss will hopefully reward Billy for his effort. Who knows, he might even start paying Billy for his work.

Either way, this adventure has given Billy Pancakes lots of material and inspiration for his scrapbooking hobby.

Total carrots left: ${ScoreManager.carrots}
Total rabidity: ${Math.floor(ScoreManager.health)}
Total score: ${ScoreManager.score}`
    
    const cam=this.cameras.main;
    
    this.endingLabel=this.add.text(cam.centerX,cam.height*0.8,string,{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      align:"center",
      strokeThickness:12+cam.height*0.005,
      fontSize:46+cam.height*0.01,
      wordWrap:{
          width:cam.width*0.9
        }
    }).setOrigin(0.5,0).setPadding(20)
    
    const shape = this.make.graphics();

        //  Create a hash shape Graphics object
        shape.fillStyle(0xffffff);

        //  You have to begin a path for a Geometry mask to work
        shape.beginPath();

        shape.fillRect(0, 0, cam.width, cam.height*0.8);
        

        const mask = shape.createGeometryMask();

        this.endingLabel.setMask(mask);
        
      const skipButton=this.add.text(cam.width*0.95,cam.height*0.9,"PLAY AGAIN!",{
        fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      align:"center",
      strokeThickness:cam.height*0.02,
      fontSize:46+cam.height*0.01
      }).setOrigin(1,0.5).setInteractive().on("pointerup",()=>{
        
        this.scene.start("TitleScreen")
      })
    
  }
  
  setupGameNotFinished(data) {
    console.log(data,"bah")
    
    const cam=this.cameras.main;
    let resultString
    let title
    let restartString
    
    if (data.win) {
      ScoreManager.score+=data.score;
      ScoreManager.health+=data.health;
      ScoreManager.carrots+=data.carrots
      title="Well done! You trapped all the rabid carrot munchers!"
      resultString=`Score: ${data.score}`
      
      restartString="Next level!"
    } else {
      title="You failed!"
      resultString=data.reason===0?
        "All the carrots were eaten.":
        "You got a little too much rabies."
      restartString="Try again!"
    }
    
    
    const titleLabel=this.add.text(cam.centerX,1+cam.height*0.03,title,{fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      align:"center",
      strokeThickness:cam.height*0.02,
      fontSize:46+cam.height*0.01,
      wordWrap:{
          width:cam.width*0.9
        }
    }).setOrigin(0.5,0).setPadding(cam.height*0.05)
    
    const resultLabel=this.add.text(cam.centerX,titleLabel.getBottomCenter().y+cam.height*0,resultString,{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      strokeThickness:cam.height*0.02,
      fontSize:46+cam.height*0.01,
      
    }).setOrigin(0.5,0).setPadding(cam.height*0)
    
    this.add.text(cam.centerX,resultLabel.getBottomCenter().y+cam.height*0.05,restartString,{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      strokeThickness:cam.height*0.02,
      fontSize:46+cam.height*0.01,
      
    }).setOrigin(0.5,0).setInteractive().on("pointerup",()=>{
      const nextIndex=data.levelIndex+ (data.win?1:0)
      console.log(data)
      if (nextIndex<Levels.length) {
        EventCenter.off()
        this.scene.stop("demo")
        this.scene.stop("gameover")
        this.scene.start("game",{levelIndex:nextIndex});
      this.scene.stop("gameover")
      }
      
    })
    

    console.log(ScoreManager)


  }
  
  update (time,delta) {
    if (this.endingLabel) {
      this.endingLabel.y-=delta*0.00006*this.cameras.main.height
    }
  }
  
}