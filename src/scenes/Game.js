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
    
  }
  
  
  update(time,delta) {
    
   
  }
}