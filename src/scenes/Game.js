import Phaser from "phaser"
import GraphicsEngine from "../graphics/GraphicsEngine"
import PhysicsEngine from "../physics/PhysicsEngine"
import CannonDebugger from 'cannon-es-debugger'

import Player from '../objects/Player'

import Platform1 from "../objects/levelObjects/Platform1"
import Pallet1 from "../objects/levelObjects/Pallet1"

const showDebugPhysics = false;

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
    if (showDebugPhysics) {
      this.physicsDebugger = new CannonDebugger(this.graphics.scene, this.physicsEngine.world.bodies, {
        //color:"#ff0000"
        scale:1.01
      })
    }
    
    const platform = new Platform1({
      graphicsScene:this.graphics.scene,
      physicsWorld:this.physicsEngine.world,
      position:{x:0, y:0, z:0},
      rotation:0,
      scale:{xz:1,y:1}
    })
    const platform2 = new Platform1({
      graphicsScene:this.graphics.scene,
      physicsWorld:this.physicsEngine.world,
      position:{x:0, y:0, z:6},
      rotation:0,
      scale:{xz:1,y:0.5}
    })
    
    const pallet = new Pallet1({
      graphicsScene:this.graphics.scene,
      physicsWorld:this.physicsEngine.world,
      position:{x:-5, y:0, z:0},
      rotation:0,
      scale:{xz:1,y:1}
    })
    
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
    
    
    if (this.showDebugPhysics) {
      //this.physicsDebugger.update();
    }
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