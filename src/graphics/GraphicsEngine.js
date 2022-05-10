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
    
    
    
    
    if (orbit){
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.renderer.domElement.style.zIndex=10
    }

  this.cameraDistance=18
    
    this.camera.position.y = 10;
    
    this.playerPosition=new THREE.Vector3()
    
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
    
    this.findObstructionRays=[
      new THREE.Raycaster(),
      new THREE.Raycaster(),
      
    ];
    
    
    this.raycaster = new THREE.Raycaster()
    this.objects=[]
    
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
  
  addObject(obj) {
    this.objects.push(obj)
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
    //console.log(this.camera.target)
    
    } catch (er) {console.log(er.message)} 
  }
  
  update(delta,data) {
    if (data.player && this.scene.player) {
      
      const playerPos=this.scene.player.position;
      const camPos=new THREE.Vector3()
      this.camera.getWorldPosition(camPos)
      
      const playerTop=playerPos.y+6;
      const playerBottom=playerPos.y-0;
      
      const playerTarget1=playerPos.clone()
      playerTarget1.y=playerTop;
      
      const playerTarget2=playerPos.clone()
      playerTarget2.y=playerBottom;

      const dir1 = playerTarget1.clone().sub(camPos).normalize()
      
      const dir2 = playerTarget2.clone().sub(camPos).normalize()
      
      const maxDistance = camPos.distanceTo(playerPos)
      
      this.findObstructionRays[0].set(camPos,dir1)
      this.findObstructionRays[1].set(camPos,dir2)
      
      this.objects.forEach(obj=>{
        obj.testObstruction(this.findObstructionRays,maxDistance)
      })
    }
      
      /*
      this.playerPosition = new THREE.Vector3(data.player.position.x,data.player.position.y,data.player.position.z)
      const playerPos2= new THREE.Vector3()
      this.scene.player.getWorldPosition(playerPos2)
      
    
      const camPos1=this.camera.position
      
      
      
      const dir1 = camPos1.clone().sub(this.playerPosition).normalize()
      const dir2 = this.playerPosition.clone().sub(camPos1).normalize()
      
      const dir3 = camPos2.clone().sub(playerPos2).normalize()
      const dir4 = this.playerPosition.clone().sub(camPos2).normalize()
      
      
      
      const dir5=new THREE.Vector3()
      this.camera.getWorldDirection(dir5)//.normalize()
      
      //console.log(dir5)
      
      const maxDistance = this.camera.position.distanceTo(this.playerPosition)
      //
      
      this.raycaster.set(camPos1,dir2)
      //this.raycaster.set(camWorldPos,camDir)
      
      try { 
      if (this.arrow)
        this.scene.remove ( this.arrow );
        this.arrow = new THREE.ArrowHelper( dir5, this.scene.player.position, 100, Math.random() * 0xffffff );
        this.scene.add( this.arrow );

      } catch (er) {console.log(er.message)} 
      
      this.objects.forEach(obj=>{
        obj.testObstruction(this.raycaster,maxDistance)
      })
    }
    */
    
    if (!orbit)
      this.updateCameraPosition(data.player)
    
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}