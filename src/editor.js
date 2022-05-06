import Phaser from 'phaser';
import Editor from "./scenes/Editor"

const toolbarHeight=300;

const editorConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1920/2,
      height: 1080+toolbarHeight
    }, 
    scene: [
      Editor
    ]
};



//export default editorConfig
const game = new Phaser.Game(editorConfig);