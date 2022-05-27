import Phaser from "phaser"

export default class LoadingScreen {
  constructor (scene) {
    const cam=scene.cameras.main
    this.bg=scene.add.rectangle(0,0,cam.width,cam.height,0x000).setOrigin(0,0).setDepth(1000)
    
    this.label=scene.add.text(
      cam.centerX,
      cam.centerY,
      "LOADING...",
      {
        fontFamily:"Acme",
        fill:"black",
        stroke:"white",
        strokeThickness:cam.height*0.02,
        fontSize:46+cam.height*0.01,
      }
    ).setOrigin(0.5,0.5).setDepth(1001)
    
  }
  
  static preload(scene) {
    scene.load.rexWebFont({
      google: {
        families: ['Acme']
      },
    });
  }
  
  destroy() {
    this.bg.destroy()
    this.label.destroy()
  }
}
