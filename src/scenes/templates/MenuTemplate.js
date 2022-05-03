import Phaser from "phaser"

export default class MenuTemplate extends Phaser.Scene {
  
  constructor(key) {
    super(key)
  }
  
  preload(fontFamiles) {
    if (fontFamiles) {
      this.load.rexWebFont({
        google: {
          families: typeof(fontFamiles)==="string"?
            [fontFamiles] :
            fontFamiles
        },
      });
      this.load.on('webfontactive', function (fileObj, familyName) {
        
      });
      this.load.on('webfontinactive', function (fileObj, familyName) {
        
      })
    }
  }
  
  create() {
    
  }
  
  
  
  update(time,delta) {
    
  }
  
}