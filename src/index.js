


import Phaser from 'phaser';
import WebFontLoaderPlugin from 'phaser3-rex-plugins/plugins/webfontloader-plugin.js';




import Game from "./scenes/Game"
import UI from "./scenes/UI"
import GameOver from "./scenes/GameOver"
import Demo from "./scenes/Demo"
import TitleScreen from "./scenes/TitleScreen"

try {
  
const screenRatio=window.innerHeight/window.innerWidth;
const gameWidth=1920*0.6

const config = {
    type: Phaser.AUTO,
    parent: 'phaserContainer',
    transparent:true,
    scale: {
      mode: Phaser.Scale.FIT,
      //autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920*0.6,
      height: gameWidth*screenRatio//1080*0.6
    }, 
    physics: {
      default: 'arcade',
      arcade: {
          debug:0,
          gravity:{y:100},
          debugBodyColor: 0x000,
      }
  },
    scene: [
      TitleScreen,
      Game,
      UI,
      GameOver,
      Demo,
    ],
    plugins: {
      global: [{
        key: 'rexWebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true
      },
      // ...
      ]
    }
};



  const game = new Phaser.Game(config);

} catch (er) {alert(er)}

