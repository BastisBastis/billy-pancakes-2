import Phaser from "phaser"
import Player from "../objects/Player"
import Muncher from "../objects/enemies/Muncher1"
import Floor from "../objects/levelObjects/Floor"
import Wall from "../objects/levelObjects/Wall"
import GraphicsEngine from "../graphics/GraphicsEngine"
import PhysicsEngine from "../physics/PhysicsEngine"
import Light from "../graphics/Light"
import EventCenter from "../helpers/EventCenter"
import LoadingScreen from "../graphics/LoadingScreen"


export default class Demo extends Phaser.Scene {
  
  constructor() {
    super("demo")
  }
  
  preload() {
    LoadingScreen.preload(this)
  }
  
  create() {
    try { 
    
    this.playerX=-4
    
    this.graphics=new GraphicsEngine({demo:true})
    this.physicsEngine=new PhysicsEngine()
    
    this.loadItems=2
    
    new Floor({
      graphicsScene:this.graphics.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:400,y:8,z:20}
    })
    new Wall({
      graphicsScene:this.graphics.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:400,y:40,z:2},
      position:{x:0,y:0,z:-3},
      rotation:0
    })
    
    Light.addLight({
      scene:this.graphics.scene,
      lightType:"ambient",
      options:{color:0x707070}
    })
    Light.addLight({
      scene:this.graphics.scene,
      lightType:"point",
        options:{
          color:0x707060,
          position:{
            x:30,
              y:40,
              z:30
            }
          }
      })
    
    this.graphics.setCameraPosition(0,10,15)
    
    this.player=new Player({
      graphicsEngine:this.graphics,
      physicsEngine:this.physicsEngine,
      position:{x:this.playerX,y:0,z:0},
      rotation:0,
      demo:true,
      onLoad:(()=>this.itemLoaded())
    })
    
    
    this.player.graphics.movement= 1
      
      
    this.enemy= new Muncher({
      graphicsEngine:this.graphics,
      physicsEngine:this.physicsEngine,
      position:{x:27,y:0,z:0},
      rotation:Math.PI/2,
      demo:true,
      onLoad:(()=>this.itemLoaded())
    })
    
    this.kickTimer=0;
    
    this.loadingScreen=new LoadingScreen(this)
    
    } catch (er) {
      console.log(er.message);
      console.log(er.stack)
    } 
  }
  
  itemLoaded() {
    this.loadItems--;
    if (this.loadItems===0) {
      this.loadingScreen.destroy()
    }
  }
  
  destroy() {
    try { 
    EventCenter.removeAllListeners()
    EventCenter.off()
    this.graphics.destroy()
    this.player.destroy()
    this.player=null
    } catch (er) {console.log(er.message)} 
  }
  
  update(time,delta) {

    try { 
    

    this.graphics.update(delta,{})
    this.physicsEngine.update(delta)
    this.player.update(delta)
    this.player.physicsBody.position.x=this.playerX
    this.enemy.update(delta)
    
    this.kickTimer--
    
    if (this.enemy.physicsBody.canJump && this.enemy.position.x<-1.5 && this.kickTimer<0) {
      
      this.kickTimer=100
      this.player.kick()
    }
    
    } catch (er) {console.log(er.message)} 
  }
  
}

