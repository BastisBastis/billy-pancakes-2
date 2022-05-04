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
    
    this.player={x:0,y:0,z:0}
    
  }
  
  
  update(time,delta) {
    this.player.x+=0.01;
    this.graphics.update(delta,{
      player:this.player
    })
   
  }
}