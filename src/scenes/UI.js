import Phaser from "phaser"

import EventCenter from "../helpers/EventCenter"


import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

import DeviceChecker from "../helpers/DeviceChecker"

export default class UI extends Phaser.Scene {
  
  constructor() {
    super("ui")
  }
  
  preload() {
    /*
    this.label=this.add.text(
      cam.centerX,
      y,
      labelString,
      {
        fontFamily:"Acme",
        fill:"black",
        stroke:"white",
        strokeThickness:15,
        fontSize:58+"px",
        fontStyle:"italic",
        wordWrap:{
          width:cam.width*0.8
        }
      }).setOrigin(0.5,0).setPadding(50)
      */
      
    this.load.rexWebFont({
      google: {
        families: ['Acme']
      },
    });
    this.load.on('webfontactive', function (fileObj, familyName) {
      //console.log('font-active: ' + familyName)
    });
    this.load.on('webfontinactive', function (fileObj, familyName) {
      //console.log('font-inactive: ' + familyName)
    })
  }
  
  create (data) {
    try { 
    
    this.mouseControl=!DeviceChecker.touch;

    this.attractions=data.attractions
    
    //Create UI elements
    
    
    this.input.addPointer(1)
    this.touchOrigin=null;
    this.touchCounter=0
    const forwardThreshold=5;
    const maxY=100;
    const maxTurn=75;
    
    this.setupLabel(data.labels)
    
    
    this.setupAttractionLabels()
    this.setupHealth()
    this.createJoystick()

    
    
    this.input.on("pointerdown",(e)=>{
      if (this.mouseControl) {
        
        if (!this.input.mouse.locked) {
          this.input.mouse.requestPointerLock()
        } else {
          EventCenter.emit("tryKick");
        }
        return false
      }
      
      this.touchCounter++;
      if (this.touchCounter==1) {
        this.touchOrigin={x:e.x,y:e.y+maxY/8*3}
      this.updateJoystick({y:1/8*3,x:0})
      this.setJoystickVisibility(true)
      EventCenter.emit("controlsUpdated",{y:0,x:0})
      } else {
        if (e.y<this.cameras.main.centerY)
          EventCenter.emit("jump")
        else
          EventCenter.emit("tryKick")
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
      if (this.mouseControl) {
  
        
        return false;
      }
        
      this.touchCounter--;
      if (this.touchCounter<1) {
        try { 
        this.touchOrigin=null
        this.updateJoystick({y:1/8*3,x:0})
        this.setJoystickVisibility(false)
        EventCenter.emit("controlsUpdated",{y:0,x:0})
        
        } catch (er) {console.log(er.message)} 
      } 
      
    })
    
    this.input.on("pointermove",(e)=>{
      if (this.mouseControl) {
        if (this.input.mouse.locked) {
          EventCenter.emit("turn", {delta:e.movementX})
        }
        
        return false;
      }
      if (!this.touchOrigin)
        return false;
      /*
      result ={
        y:true|false should move
        x:-1 to 1 turn factor
      }
      
      */
      
      const yFrac=Math.max(Math.min(this.touchOrigin.y-e.y,maxY),0)/maxY
      const xFrac=Math.max(Math.min(e.x-this.touchOrigin.x,maxTurn),-maxTurn)/maxTurn
      
      let yResult;
      if (yFrac>0&&yFrac<0.5){
        yResult=0;
      } else if (yFrac===0) {
        yResult=yFrac*2-0.5
      } else {
        yResult=yFrac*2-1
      }
      
      
      
      const result={
        
        y:yResult,
        x:xFrac
      }
      
      
      
      this.updateJoystick({y:yFrac,x:xFrac})
      EventCenter.emit("controlsUpdated",result)
    })
    
    
    
    } catch (er) {console.log(er.message)} 
  }

  
  
  setupLabel(labels) {
    this.label=this.add.text(this.cameras.main.centerX,this.cameras.main.height-50,"", {
        fontFamily:"Acme",
        fill:"black",
        stroke:"white",
        strokeThickness:this.cameras.main.height*0.02,
        align:"center",
        fontSize:this.cameras.main.height*0.06,
        //fontStyle:"italic",
        wordWrap:{
          width:this.cameras.main.width*0.8
        }
      }).setOrigin(0.5,1).setPadding(50)
      
    this.timeouts=[]
    
    labels.forEach(label=>{
      
      const touch=DeviceChecker.touch;
      if ((touch&&label.mouseOnly) || (!touch && label.touchOnly)) {
        return false
      }
      
      this.timeouts.push(setTimeout(()=>{
        this.label.text=label.string
        this.timeouts.push(setTimeout(()=>{
          if (this.label.text==label.string)
            this.label.text=""
        },label.duration))
      },label.start))
    })
  }
  
  setupHealth() {
    const cam = this.cameras.main
    const barWidth=300;
    const barHeight=cam.height*0.07;
    const label=this.add.text(30,cam.height*0.03,"Rabidity:",{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      strokeThickness:14,
      fontSize:30+cam.height*0.03
    }).setOrigin(0,0)
    
    const fill=this.add.rectangle(30, label.getBottomCenter().y ,0,barHeight,0x9090ff).setOrigin(0,0);
    const frame=this.add.rectangle(30, label.getBottomCenter().y ,barWidth,barHeight,0xffffff,0).setStrokeStyle(4,0x000000).setOrigin(0,0);
    
    
    EventCenter.on("updateRabiesCount",data=>{
      //console.log(data.rabiesCount)
      fill.width=barWidth*data.rabiesCount
    })
  }
  
  setupAttractionLabels() {
    const labels=[]
    this.attractions.filter(att=>!att.isPlayer).forEach(attraction=>{
      const label=this.add.text(50,50,"",{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      strokeThickness:this.cameras.main.height*0.01,
      fontSize:this.cameras.main.height*0.08
    }).setOrigin(0.5,0.5)
      labels.push(label)
    })
    
    EventCenter.on("destroyAttraction",data=>{
      labels[data.index].destroy()
    })
    
    EventCenter.on("updateAttractionPosition",data=>{
      const label=labels[data.index]
      
      const cam = this.cameras.main
      label.x=cam.width*(0.5+data.position.x/2)
      label.y=cam.height*(0.5-data.position.y/2)
      label.text="Carrots: "+(Math.ceil(data.count))
      
      label.setFontSize(Math.min(Math.max(100-data.distance,40),90)/100*this.cameras.main.height*0.065)
    })
  }
  
  createJoystick() {
    const cam = this.cameras.main
    const joystickWidth=180;
    const joystickHeight=180;
    
    const markerWidth=30;
    const markerHeight=30;
    const markerRadius=15
    
    this.joystickBg=new RoundRectangle(this,cam.width-100-joystickWidth,100,joystickWidth,joystickHeight,markerRadius,0xffffff,0.6).setStrokeStyle(4,0x000000).setOrigin(0,0);
    this.add.existing(this.joystickBg)
    
    
    this.joystickMarker=this.add.circle(
      this.joystickBg.x+joystickWidth/2,
      this.joystickBg.y+joystickHeight-markerHeight/2,
      markerRadius,
      0x000
    ).setOrigin(0.5,0.5)
    
    this.setJoystickVisibility(false)
  }
  
  updateJoystick(data){
    this.joystickBg.fillColor=data.y>0.5?
      (data.y>0.75?
        0x006600:
        0x888800):
      (data.y>0?0xffffff:0x660000);
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
  
  close() {
    this.attractions=null
    this.timeouts.forEach(to=>{
      clearTimeout(to)
    })
  }
  
  update(time,delta) {
    
  }
  
}