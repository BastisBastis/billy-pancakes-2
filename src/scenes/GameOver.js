import Phaser from "phaser"
import Levels from "../assets/data/Levels"


export default class GameOver extends Phaser.Scene {
  constructor() {
    super("gameover")
  }
  
  preload() {
    
  }
  
  create(data) {
    const cam=this.cameras.main;
    cam.setBackgroundColor("#9090aa")
    
    let resultString
    let title
    let restartString
    
    if (data.win) {
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
    
    this.add.text(cam.centerX,100,title,{fontSize:54}).setOrigin(0.5,0.5)
    this.add.text(cam.centerX,200,resultString,{fontSize:54}).setOrigin(0.5,0.5)
    
    this.add.text(cam.centerX,400,restartString,{fontSize:64}).setOrigin(0.5,0.5).setInteractive().on("pointerup",()=>{
      const nextIndex=data.levelIndex+ (data.win?1:0)
      
      if (nextIndex<Levels.length) {
        this.scene.start("game",{levelIndex:nextIndex});
      this.scene.stop("gameover")
      }
      
    })
  }
}