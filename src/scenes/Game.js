import Phaser from "phaser"
import GraphicsEngine from "../graphics/GraphicsEngine"
import PhysicsEngine from "../physics/PhysicsEngine"

import Player from '../objects/Player'


export default class Game extends Phaser.Scene {
  constructor() {
    super({key:"Game"});
  }
  
  preload() {
    
  }
  
  create() {
    try{
    
    this.graphics=new GraphicsEngine()
    this.physicsEngine=new PhysicsEngine()
    
    
    
    this.player=new Player({
      graphicsEngine:this.graphics,
      physicsEngine:this.physicsEngine
    })
    
    this.scene.launch("ui")
    
    } catch (er) {console.log(er.message);console.log(er.stack)}
  }
  
  
  update(time,delta) {
    
    try { 
    
    this.physicsEngine.update(delta)
    
    this.player.update(delta)
    
    
    
    this.graphics.update(delta,{
      player:{
        position:this.player.position,
        rotation:this.player.rotation
      }
    })
   
   } catch (er) {
   console.log(er.message,er.stack)
     } 
  }
}