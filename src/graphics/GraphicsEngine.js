import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import BillyGLTF from '../assets/models/characters/Billy3.glb'
import PlayerModel from "./PlayerModel"

export default class GraphicsEngine {
  
  constructor () {
    
     
  try {
    
    const canvas = document.querySelector('#threeCanvas');
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000)
    
    this.renderer = new THREE.WebGLRenderer({canvas})
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    
    this.scene.background = new THREE.Color( 0x87CEFA );
    
    const light1 = new THREE.PointLight(0xffffff, 2)
light1.position.set(2.5, 2.5, 2.5)
this.scene.add(light1)
    
    const ambLight = new THREE.AmbientLight( 0x808080 ); // soft white light
    this.scene.add( ambLight );
    
    
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    

  this.camera.position.z = 10;
  this.camera.position.y = 8;
  this.playerModel = new PlayerModel({
    scene:this.scene
  })

    this.controls.update()
    
    
    } catch (er) {console.log(er.message)}
  }
  
  
  
  update(delta,data) {
    
    this.playerModel.update(delta)
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}