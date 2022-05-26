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
    if (data.levelIndex===0) {
      ScoreManager.health=0;
      ScaleManager.carrots=0;
    }
    const cam=this.cameras.main;
    //cam.setBackgroundColor("#9090aa")
    this.scene.launch("demo")
    this.scene.sendToBack("demo")
    
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
      //console.log(nextIndex)
      if (nextIndex<Levels.length) {
        EventCenter.off()
        this.scene.stop("demo")
        this.scene.start("game",{levelIndex:nextIndex});
      //this.scene.stop("gameover")
      }
      
    })
    
    console.log(ScoreManager)
  }
}