import Phaser from "phaser"


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
    
    if (data.win) {
      title="Well done! You trapped all the rabid carrot munchers!"
      resultString=`Score: ${data.score}`
    } else {
      title="You failed!"
      resultString=data.reason===0?
        "All the carrots were eaten.":
        "You got a little too much rabies."
    }
    
    this.add.text(cam.centerX,100,title,{fontSize:64}).setOrigin(0.5,0.5)
    this.add.text(cam.centerX,200,resultString,{fontSize:54}).setOrigin(0.5,0.5)
  }
}