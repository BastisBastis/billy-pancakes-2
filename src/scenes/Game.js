import Phaser from "phaser"
import GraphicsEngine from "../graphics/GraphicsEngine"
import PhysicsEngine from "../physics/PhysicsEngine"
import CannonDebugger from 'cannon-es-debugger'

import Player from '../objects/Player'

import Level from "../objects/Level"

import EventCenter from "../helpers/EventCenter"




const showDebugPhysics = false

export default class Game extends Phaser.Scene {
  constructor() {
    super({key:"game"});
  }
  
  preload() {
    
  }
  
  create({
    levelIndex=0
  }) {
    
    
    try{
    //console.log("li",levelIndex)
    this.graphics=new GraphicsEngine()
    this.physicsEngine=new PhysicsEngine()
    if (showDebugPhysics) {
      this.physicsDebugger = new CannonDebugger(this.graphics.scene, this.physicsEngine.world.bodies, {
        //color:"#ff0000"
        scale:1.01
      })
    }
    
    //this.level= Level.testLevel(this.graphics,this.physicsEngine)
    this.level= Level.fromIndex(this.graphics,this.physicsEngine,levelIndex)
    
    this.enemies=this.level.enemies;
    
    this.player=new Player({
      graphicsEngine:this.graphics,
      physicsEngine:this.physicsEngine,
      position:this.level.playerStartPosition,
      rotation:this.level.playerStartRotation
    })
    
    this.barrelCount=this.level.attractions.length;
    this.destroyedBarrels=0;
    this.enemiesTrapped=0;
    
    this.level.attractions.push(this.player)
    
    EventCenter.on("death",()=>{
      EventCenter.emit("gameover",{
          win:false,
          reason:1,
          levelIndex:levelIndex
        })
    })
    
    EventCenter.on("destroyAttraction",data=>{
      this.destroyedBarrels++;
      if (this.destroyedBarrels>=this.barrelCount) {
        EventCenter.emit("gameover",{
          win:false,
          reason:0,
          levelIndex:levelIndex
        })
      }
    })
    
    EventCenter.on("enemyTrapped",()=>{
      this.enemiesTrapped++;
      if (this.enemiesTrapped>=this.level.enemies.length) {
        let score=0;
        this.level.attractions.forEach(att=>{
          if (att.isPlayer) {
            score+=100-att.rabiesCount
            
          } else {
            score+=att.carrotCount
            
          }
        })
        setTimeout(()=>{
          EventCenter.emit("gameover",{
            win:true,
            score:Math.floor(score),
            levelIndex:levelIndex
          })
        },1500)
        
      }
      
    })
    
    
    this.scene.launch("ui",{
      attractions:this.level.attractions,
      labels:this.level.labels
    })
    
    EventCenter.once("gameover",data=>{
      setTimeout(()=>{
        try { 
        EventCenter.removeAllListeners()
        EventCenter.off()
        this.registry.destroy()
        this.graphics.destroy()
        this.player.destroy()
        this.level.destroy()
        delete this.level
        delete this.graphics
        delete this.physicsEngine
        if (this.physicsDebugger)
          delete this.physicsDebugger
        delete this.player
        delete this.enemies
        this.input.mouse.releasePointerLock()
        
        this.scene.get("ui").close()
        this.scene.stop("ui");
        this.scene.stop("game")
        this.scene.start("gameover",data)
        
        } catch (er) {console.log(er.message)} 
        
      },0)
    })
      
    
    } catch (er) {console.log(er.message);console.log(er.stack)}
  }
  
  
  update(time,delta) {
    
    try { 
    
    this.physicsEngine.update(delta)
    
    this.player.update(delta)
    
    
    if (this.showDebugPhysics) {
      //this.physicsDebugger.update();
    }
    
    //console.log(this.player.position)
    this.graphics.update(delta,{
      player:{
        position:this.player.position,
        rotation:this.player.rotation
      }
    })
    
    this.enemies.forEach(enemy=>{
      enemy.update(delta)
    })
    
    this.level.attractions.forEach(attraction=>{
      if (!attraction.isPlayer) {
        attraction.update(delta)
      }
    })
   
   } catch (er) {
   //console.log(er.message,er.stack)
     } 
  }
}

