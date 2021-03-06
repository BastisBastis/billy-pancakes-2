import EventCenter from "./EventCenter"

import Jump from "../assets/audio/Jump.m4a"
import KickHit from "../assets/audio/KickHit.m4a"
import Fly from "../assets/audio/Fly.m4a"
import Kick from "../assets/audio/KickAir.m4a"
import Munch from "../assets/audio/Munch.m4a"

export default class SFX {
  
  constructor(scene) {
    
    scene.sound.add("jump");
    scene.sound.add("kickHit");
    scene.sound.add("fly");
    scene.sound.add("kick");
    scene.sound.add("munch")
    
    const configs={
      kickHit:{},
      jump:{rate:1.4},
      fly:{rate:2.2}
    }
    
    EventCenter.on("playSound",data=>{
      scene.sound.play(data.sound,this.configs()[data.sound])
    })
  }
  
  configs() {
    return {
      kickHit:{rate:0.9+Math.random()*0.1},
      jump:{rate:1.4+Math.random()*0.2},
      fly:{rate:1.9+Math.random()*0.3},
      kick:{
        rate:0.9+Math.random()*0.1,
        
        volume:0.3
      }
    }
  }
  
  
  static preload(scene) {
    scene.load.audio("jump",Jump)
    scene.load.audio("fly",Fly)
    scene.load.audio("kickHit",KickHit)
    scene.load.audio("kick",Kick)
    scene.load.audio("munch",Munch)
  }
  
}