import * as THREE from "three"

export default class PlayerAnimationManager {
  constructor(animations,start="idle") {
    this.animations=animations;
    this.states={
      running:false,
      walking:false,
      backing:false,
      jumping:false,
      picking:false,
      kicking:false,
      strafingR:false,
      strafingL:false
    }
    
    this.jumpTimeFactor=0.5;
    this.kickTimeFactor=1.8
    
    this.animations[start].play()
    this.currentAnimation=start
    this._nextAnimation=false;
        
        
    this.animations.jump.setLoop(THREE.LoopOnce)
    this.animations.jump.setEffectiveTimeScale(this.jumpTimeFactor)
    this.animations.kick.setLoop(THREE.LoopOnce)
    this.animations.kick.setEffectiveTimeScale(this.kickTimeFactor)
    
    this.fadeTime=0.2;
    this.jumpFadeOutTime=0.5
    
    this.animationTimeoutId=false;
  }
  
  get nextAnimation() {
    return this._nextAnimation;
  }
  
  set nextAnimation(value) {
    this._nextAnimation=value;
  }
  
  play(animation) {
    
    if (animation==="idle") {
      //Idle === not moving
      this.states.running=false;
      this.states.walking=false;
      this.states.backing=false;
      if (!this.states.jumping && !this.states.kicking) {
        this.animations.idle.reset()
        this.animations.idle.play()
        
        this.animations[this.currentAnimation].crossFadeTo(this.animations.idle,this.fadeTime)
        this.currentAnimation="idle"
        this.nextAnimation=false;
      } else {
        this.nextAnimation="idle"
      }
    } else if (animation==="run"||animation==="walk" || animation==="back" || animation==="strafeL" || animation==="strafeR") {
      
      if (animation==="walk") {
        this.states.running=false;
        this.states.walking=true;
        this.states.backing=false;
        this.states.strafingR=false;
        this.states.strafingL=false;
      } else if (animation==="run"){
        this.states.running=true;
        this.states.walking=false
        this.states.backing=false
        this.states.strafingR=false;
        this.states.strafingL=false;
      } else if (animation==="back"){
        this.states.running=false;
        this.states.walking=false;
        this.states.backing=true
        this.states.strafingR=false;
        this.states.strafingL=false;
      } else if (animation==="strafeL") {
        this.states.running=false;
        this.states.walking=false;
        this.states.backing=false
        this.states.strafingR=false;
        this.states.strafingL=true;
      } else if (animation==="strafeR") {
        this.states.running=false;
        this.states.walking=false;
        this.states.backing=false
        this.states.strafingR=true;
        this.states.strafingL=false;
      }
      
      if (!this.states.jumping && !this.states.kicking) {
        this.animations[animation].reset()
        this.animations[animation].play()
       
        this.animations[this.currentAnimation].crossFadeTo(this.animations[animation],this.fadeTime)
        this.currentAnimation=animation
        this.nextAnimation=false;
      } else {
        this.nextAnimation=animation
      }
    } else if (animation==="jump") {
      if (this.animationTimeoutId)
        clearTimeout(this.animationTimeoutId)
        
      
      this.animations.jump.reset()
      this.animations.jump.play()
      this.animations[this.currentAnimation].crossFadeTo(this.animations.jump,this.fadeTime)
      
      if (!this.states.kicking)
        this.nextAnimation=this.currentAnimation;
        
      this.states.kicking=false;
      this.states.jumping=true;
      
      this.currentAnimation="jump";
      
      //console.log(this.nextAnimation)
      this.animationTimeoutId=setTimeout(()=>{
        this.states.jumping=false
        //console.log(this.nextAnimation)
        this.animations[this.nextAnimation].reset()
        this.animations[this.nextAnimation].play()
        this.animations.jump.crossFadeTo(this.animations[this.nextAnimation],this.jumpFadeOutTime)
        
        
        this.currentAnimation=this.nextAnimation;
        this.nextAnimation=false;
      },(this.animations.jump._clip.duration/this.jumpTimeFactor-this.jumpFadeOutTime)*1000)
    } 
    
    else if (animation==="kick") {
      if (this.animationTimeoutId)
        clearTimeout(this.animationTimeoutId)
        
      
      this.animations.kick.reset()
      this.animations.kick.play()
      this.animations[this.currentAnimation].crossFadeTo(this.animations.kick,this.fadeTime)
      
      if (!this.states.jumping)
        this.nextAnimation=this.currentAnimation;
      this.currentAnimation="kick";
      this.states.jumping=false;
      this.states.kicking=true;
      
      //console.log(this.nextAnimation)
      this.animationTimeoutId=setTimeout(()=>{
        this.states.kicking=false
        //console.log(this.nextAnimation)
        this.animations[this.nextAnimation].reset()
        this.animations[this.nextAnimation].play()
        this.animations.kick.crossFadeTo(this.animations[this.nextAnimation],this.fadeTime)
        
        
        this.currentAnimation=this.nextAnimation;
        this.nextAnimation=false;
      },(this.animations.kick._clip.duration/this.kickTimeFactor-this.fadeTime)*1000)
    }
  }
}