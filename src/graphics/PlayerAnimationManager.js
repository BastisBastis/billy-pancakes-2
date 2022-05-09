import * as THREE from "three"

export default class PlayerAnimationManager {
  constructor(animations) {
    this.animations=animations;
    this.states={
      running:false,
      walking:false,
      jumping:false,
      picking:false
    }
    
    this.jumpTimeFactor=0.65;
    
    this.animations.idle.play()
    this.currentAnimation="idle"
    this._nextAnimation=false;
        
        
    this.animations.jump.setLoop(THREE.LoopOnce)
    this.animations.jump.setEffectiveTimeScale(this.jumpTimeFactor)
    
    this.fadeTime=0.2;
    
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
      if (!this.states.jumping && !this.states.picking) {
        this.animations.idle.reset()
        this.animations.idle.play()
        
        this.animations[this.currentAnimation].crossFadeTo(this.animations.idle,this.fadeTime)
        this.currentAnimation="idle"
        this.nextAnimation=false;
      } else {
        this.nextAnimation="idle"
      }
    } else if (animation==="run"||animation==="walk") {
      if (animation==="walk") {
        this.states.running=false;
        this.states.walking=true;
      } else {
        this.states.running=true;
        this.states.walking=false
      }
      
      if (!this.states.jumping && !this.states.picking) {
        this.animations[animation].reset()
        this.animations[animation].play()
        this.animations[this.currentAnimation].crossFadeTo(this.animations[animation],this.fadeTime)
        this.currentAnimation=animation
        this.nextAnimation=false;
      } else {
        this.nextAnimation=animation
      }
    } else if (animation==="jump") {
      this.states.jumping=true;
      this.animations.jump.reset()
      this.animations.jump.play()
      this.animations[this.currentAnimation].crossFadeTo(this.animations.jump,this.fadeTime)
      
      this.nextAnimation=this.currentAnimation;
      this.currentAnimation="jump";
      
      console.log(this.nextAnimation)
      this.animationTimeoutId=setTimeout(()=>{
        this.states.jumping=false
        console.log(this.nextAnimation)
        this.animations[this.nextAnimation].reset()
        this.animations[this.nextAnimation].play()
        this.animations.jump.crossFadeTo(this.animations[this.nextAnimation],this.fadeTime)
        
        
        this.currentAnimation=this.nextAnimation;
        this.nextAnimation=false;
      },(this.animations.jump._clip.duration/this.jumpTimeFactor-this.fadeTime)*1000)
    }
  }
}