import Phaser from "phaser"
import MusicManager from "../helpers/MusicManager"
import Music from "../assets/audio/Billys bounce.mp3"

const muted=false

export default class TitleScreen extends Phaser.Scene {
 
  
  constructor () {
    super("TitleScreen");
    
  }
  
  preload() {
    
    this.load.audio("music",Music)
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
  
  create() {
    try {
      
    if (!MusicManager.isPlaying && !muted) {
        MusicManager.ref=this.sound.add("music")
        MusicManager.ref.play({loop:true})
        MusicManager.isPlaying=true
      }
      
    const demoRunning = this.scene.isActive("demo")
    if (!demoRunning)
      this.scene.launch("demo")
    this.scene.bringToTop("TitleScreen");
      
    this.showTitle()
    
    
    
    } catch (er) {
      console.log(er.message)
      console.log(er.stack)
    }
  }
  
  showTitle() {
    const cam=this.cameras.main;
    //cam.setBackgroundColor("#ddddff");
    
    this.title=this.add.text(
      cam.centerX,
      cam.height*0.2,
      "BILLY PANCAKES",
      {
        fontFamily:"Acme",
        fill:"#000000",
        stroke:"white",
        strokeThickness:20,
        fontSize:126,
      }).setOrigin(0.5,0.5).setPadding(50)//.setShadow(3, 2, "#9999cc", 5, false, true);
    
    this.subTitle=this.add.text(
      cam.centerX,
      cam.height*0.4,
      "and the Rabid Carrot Munchers",
      {
        fontFamily:"Acme",
        fill:"black",
        stroke:"white",
        strokeThickness:15,
        fontSize:64+"px",
        fontStyle:"italic"
      }).setOrigin(0.5,0.5).setPadding(50)
      
    this.gradiantPosition=0
    
    
    
    this.input.on("pointerdown",()=>{
      /*
      this.cameras.main.fadeOut(500, 221,170,238)
      //this.scene.get("Game").cameras.main.fadeOut(500, 0, 0, 0);
      setTimeout(()=>{
        this.scene.start("Game",{demo:false,newLevel:true});
      },500)
      */
      this.showIntro()
      
   })
  }
  
  showIntro() {
    try {
    
    const string=`Billy Pancakes’ job is to sort carrots alphabetically at a super market. He takes great pride in his work.

But the warehouse is suffering from a terrible infestation of RABID CARROT MUNCHERS!

Billy has taken it upon himself to trap all the carrot munchers before they eat all the carrots.`
    
    const cam=this.cameras.main;
    this.title.destroy();
    this.title=false;
    this.subTitle.destroy();
    this.subTitle=false;
    this.input.off("pointerdown")
    this.introLabel=this.add.text(cam.centerX,cam.height*0.8,string,{
      fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      align:"center",
      strokeThickness:12+cam.height*0.005,
      fontSize:46+cam.height*0.01,
      wordWrap:{
          width:cam.width*0.9
        }
    }).setOrigin(0.5,0).setPadding(20)
    
    const shape = this.make.graphics();

        //  Create a hash shape Graphics object
        shape.fillStyle(0xffffff);

        //  You have to begin a path for a Geometry mask to work
        shape.beginPath();

        shape.fillRect(0, 0, cam.width, cam.height*0.8);
        

        const mask = shape.createGeometryMask();

        this.introLabel.setMask(mask);
        
      const skipButton=this.add.text(cam.width*0.95,cam.height*0.9,"START!",{
        fontFamily:"Acme",
      fill:"black",
      stroke:"white",
      align:"center",
      strokeThickness:cam.height*0.02,
      fontSize:46+cam.height*0.01
      }).setOrigin(1,0.5).setInteractive().on("pointerup",()=>{
        this.scene.get("demo").destroy()
        this.scene.stop("demo")
        this.scene.stop("TitleScreen")
        this.scene.start("game")
        
      })
    
    
    } catch (er) {alert(er)}
  }
  
  
  
  update(time,delta) {
    if (this.title) {
      this.gradiantPosition= this.gradiantPosition>3?0:this.gradiantPosition+0.07*delta/100
      const gradient = this.title.context.createLinearGradient(0, 0, 100, 1000);
      
      const clamp=value=>Math.max(0,Math.min(1,value))
      
      const min=clamp(this.gradiantPosition-0.1)
      const center=clamp(this.gradiantPosition)
      const max=clamp(this.gradiantPosition+0.1)
      gradient.addColorStop(min, '#000000');
      gradient.addColorStop(center, '#aaaaaa');
      
      gradient.addColorStop(max, '#000000');
  
      this.title.setFill(gradient);
    } else if (this.introLabel) {
      this.introLabel.y-=delta*0.00006*this.cameras.main.height
    }
  }
  
}