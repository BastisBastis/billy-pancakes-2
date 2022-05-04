import Phaser from "phaser"
import GraphicsEngine from "../graphics/GraphicsEngine"


export default class Game extends Phaser.Scene {
  constructor() {
    super({key:"Game"});
  }
  
  preload() {
    
  }
  
  create() {
    this.graphics=new GraphicsEngine()
    
    this.add.text(100,100, 'hello')
    
    this.player={x:0,y:0,z:0,rotation:0}
    
  }
  
  
  update(time,delta) {
    
    try { 
    const moveSpeed=0.05;
    const turnSpeed=0.05;
    
    if (this.input.activePointer.active && this.input.activePointer.x>0) {
      if (this.input.activePointer.x<this.cameras.main.centerX) 
        this.player.rotation-=turnSpeed;
      else
        this.player.rotation+=turnSpeed;
    }
    this.player.x+=moveSpeed*Math.cos(this.player.rotation)
    this.player.z+=moveSpeed*Math.sin(this.player.rotation)
    
    this.graphics.update(delta,{
      player:this.player
    })
   
   } catch (er) {console.log(er.message)} 
  }
}