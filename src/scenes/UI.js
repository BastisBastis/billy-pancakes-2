import Phaser from "phaser"

import EventCenter from "../helpers/EventCenter"

export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  create () {
    try { 
    
    //Create UI elements
    this.createJoystick()
    
    this.input.addPointer(1)
    this.touchOrigin=null;
    this.touchCounter=0
    const forwardThreshold=5;
    const maxY=100;
    const maxTurn=75;
    
    this.input.on("pointerdown",(e)=>{
      this.touchCounter++;
      if (this.touchCounter==1) {
        this.touchOrigin={x:e.x,y:e.y}
      this.updateJoystick({y:0,x:0})
      this.setJoystickVisibility(true)
      EventCenter.emit("controlsUpdated",{y:0,x:0})
      } else {
        EventCenter.emit("jump")
      }
      
    })

    this.input.keyboard.on('keydown-SPACE', function (event) {
      EventCenter.emit("jump")
    });

    this.input.keyboard.on('keydown-A', e=>{
      EventCenter.emit("controlsUpdated",{x:-1})
    })
    this.input.keyboard.on('keydown-D', e=>{
      EventCenter.emit("controlsUpdated",{x:1})
    })
    this.input.keyboard.on('keyup-A', e=>{
      EventCenter.emit("controlsUpdated",{x:0})
    })
    this.input.keyboard.on('keyup-D', e=>{
      EventCenter.emit("controlsUpdated",{x:0})
    })
    this.input.keyboard.on('keydown-W',e=>{
      EventCenter.emit("controlsUpdated",{y:1})
    })
    this.input.keyboard.on('keyup-W',e=>{
      EventCenter.emit("controlsUpdated",{y:0})
    })

    this.input.on("pointerup",(e)=>{
      this.touchCounter--;
      if (this.touchCounter<1) {
        try { 
        this.touchOrigin=null
        this.updateJoystick({y:0,x:0})
        this.setJoystickVisibility(false)
        EventCenter.emit("controlsUpdated",{y:0,x:0})
        
        } catch (er) {console.log(er.message)} 
      } 
      
    })
    
    this.input.on("pointermove",(e)=>{
      if (!this.touchOrigin)
        return false;
      /*
      result ={
        y:true|false should move
        x:-1 to 1 turn factor
      }
      
      */
      const result={
        y:Math.max(Math.min(this.touchOrigin.y-e.y,maxY),0)/maxY,
        x:Math.max(Math.min(e.x-this.touchOrigin.x,maxTurn),-maxTurn)/maxTurn
      }
      this.updateJoystick(result)
      EventCenter.emit("controlsUpdated",result)
    })
    
    
    
    } catch (er) {console.log(er.message)} 
  }
  
  createJoystick() {
    const cam = this.cameras.main
    const joystickWidth=180;
    const joystickHeight=180;
    this.joystickBg=this.add.rectangle(cam.width-100-joystickWidth,100,joystickWidth,joystickHeight,0xffffff).setStrokeStyle(4,0x000000).setOrigin(0,0);
    
    const markerWidth=30;
    const markerHeight=30;
    this.joystickMarker=this.add.rectangle(
      this.joystickBg.x+joystickWidth/2,
      this.joystickBg.y+joystickHeight-markerHeight/2,
      markerWidth,
      markerHeight,
      0x000
    ).setOrigin(0.5,0.5)
    
    this.setJoystickVisibility(false)
  }
  
  updateJoystick(data){
    this.joystickBg.fillColor=data.y>0?
      (data.y>0.5?
        0x00ff00:
        0xffff00):
      0xffffff;
    //this.joystickMarker.y=this.joystickBg.y+ (data.y?0:this.joystickMarker.height);
    
    const originY=this.joystickBg.y+this.joystickBg.height-this.joystickMarker.height/2;
    const maxDeltaY=this.joystickBg.height-this.joystickMarker.height
    this.joystickMarker.y=originY-maxDeltaY*data.y
    
    const originX=this.joystickBg.x+this.joystickBg.width/2;
    const maxDeltaX=this.joystickBg.width/2-this.joystickMarker.width/2;
    this.joystickMarker.x=originX+maxDeltaX*data.x
  }
  
  setJoystickVisibility(value){
    this.joystickBg.visible=value;
    this.joystickMarker.visible=value;
  }
  
  update(time,delta) {
    
  }
  
}