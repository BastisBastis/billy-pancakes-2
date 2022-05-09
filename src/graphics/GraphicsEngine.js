import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import BillyGLTF from '../assets/models/characters/Billy3.glb'
import PlayerModel from "./PlayerModel"

const orbit=false;

export default class GraphicsEngine {
  
  constructor () {
    
     
  try {
    
    const canvas = document.querySelector('#threeCanvas');
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000)
    
    this.renderer = new THREE.WebGLRenderer({canvas})
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color( 0x87CEFA );
    
    
    /*
    const light1 = new THREE.PointLight(0xcdcdcd, 2)
light1.position.set(2.5, 2.5, 2.5)
this.scene.add(light1)
    
    const ambLight = new THREE.AmbientLight( 0x808080 ); // soft white light
    this.scene.add( ambLight );
    */
    
    if (orbit){
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.renderer.domElement.style.zIndex=10
    }

  this.cameraDistance=18
    
    this.camera.position.y = 10;
    
    
    /*
    //temp Floor
    var geo = new THREE.PlaneBufferGeometry(40,40,2,2)
    var material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color("black")
        },
        color2: {
          value: new THREE.Color("pink")
        }
      },
      vertexShader: `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
      
        varying vec2 vUv;
        
        void main() {
          
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
      wireframe: false,
      side:2
      
    });
    var mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x=Math.PI/2
    //this.scene.add(mesh)
    
    */
    
    if (orbit)
      this.controls.update()
    
    
    } catch (er) {console.log(er.message)}
  }
  
  addBox(position,size,rotation) {
    const geo = new THREE.BoxBufferGeometry(size.width,size.height,size.depth);
    const mat = new THREE.MeshStandardMaterial({color:"blue",wireframe:true})
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.x=position.x
    mesh.position.y=position.y+size.height/2;
    mesh.position.z=position.z
    
    mesh.setRotationFromAxisAngle(new THREE.Vector3(0,1,0),rotation)
    
    this.scene.add(mesh)
    
    mesh.setRotation=(rot=>{
      mesh.rotation.y=-rot;
    })
    
    mesh.setPosition=(x,y,z)=>{
      mesh.position.x=x
      mesh.position.y=y+size.height/2
      mesh.position.z=z
    }
    
    return mesh
  }
  
  updateCameraPosition(playerData) {
    try { 
    
    this.camera.position.set(
      playerData.position.x-Math.cos(playerData.rotation)*this.cameraDistance,
      playerData.position.y+10,
      playerData.position.z-Math.sin(playerData.rotation)*this.cameraDistance
    )
    
    /*
    this.camera.position.set(
      playerData.position.x-15,
      playerData.position.y+15,
      playerData.position.z-15 
    )
    */
    
    this.camera.lookAt(playerData.position.x,playerData.position.y,playerData.position.z)
    
    } catch (er) {console.log(er.message)} 
  }
  
  update(delta,data) {
    
    if (!orbit)
      this.updateCameraPosition(data.player)
    
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}