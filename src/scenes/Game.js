import Phaser from "phaser"
import GraphicsEngine from "../graphics/GraphicsEngine"
import PhysicsEngine from "../physics/PhysicsEngine"
import CannonDebugger from 'cannon-es-debugger'

import Player from '../objects/Player'

import Level from "../objects/Level"

import EventCenter from "../helpers/EventCenter"
import SFX from "../helpers/SFX"

import LoadingScreen from "../graphics/LoadingScreen"


const showDebugPhysics = false

export default class Game extends Phaser.Scene {
  constructor() {
    super({key:"game"});
  }
  
  preload() {
    SFX.preload(this)
  }
  
  create({
    levelIndex=0,
    onLoad=()=>false
  }) {
    
    
    try{
      //this.onLoad=onLoad
    //console.log("li",levelIndex)
    this.loadingScreen=new LoadingScreen(this)
    this.graphics=new GraphicsEngine({})
    this.physicsEngine=new PhysicsEngine()
    if (showDebugPhysics) {
      this.physicsDebugger = new CannonDebugger(this.graphics.scene, this.physicsEngine.world.bodies, {
        //color:"#ff0000"
        scale:1.01
      })
    }
    
    this.itemsToLoad=2;
    
    this.sfx=new SFX(this)
    
    //this.level= Level.testLevel(this.graphics,this.physicsEngine)
    this.level= Level.fromIndex(this.graphics,this.physicsEngine,levelIndex,()=>this.itemLoaded())
    
    this.enemies=this.level.enemies;
    
    this.scene.launch("ui",{
      attractions:this.level.attractions,
      labels:this.level.labels
    })
    
    this.player=new Player({
      graphicsEngine:this.graphics,
      physicsEngine:this.physicsEngine,
      position:this.level.playerStartPosition,
      rotation:this.level.playerStartRotation,
      onLoad:()=>this.itemLoaded()
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
        let health
        let carrots=0;
        this.level.attractions.forEach(att=>{
          if (att.isPlayer) {
            score+=100-att.rabiesCount
            health=att.rabiesCount
            
          } else {
            score+=att.carrotCount
            carrots+=att.carrotCount;
          }
        })
        setTimeout(()=>{
          EventCenter.emit("gameover",{
            win:true,
            score:Math.floor(score),
            health:health,
            carrots:carrots,
            levelIndex:levelIndex
          })
        },1500)
        
      }
      
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

        console.log(data);

        this.scene.get("ui").close()
        
        this.scene.stop("ui");
        //this.scene.stop("game")
        
        this.scene.start("gameover", data)
        console.log(2)
        
        } catch (er) {console.log(er.message)} 
        
      },0)
    })
      
    
    } catch (er) {console.log(er.message);console.log(er.stack)}
  }
  
  itemLoaded() {
    
    this.itemsToLoad--;
    if (this.itemsToLoad===0) {
      this.loadingScreen.destroy()
    }
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

