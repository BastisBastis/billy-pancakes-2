import * as THREE from "three"

export default class GraphicsEngine {
  
  constructor () {
    
    this.canvas = document.querySelector('#threeCanvas');
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,1000)
    this.renderer = new THREE.WebGLRenderer(this.canvas)
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    
    this.scene.background = new THREE.Color( 0x87CEFA );
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}