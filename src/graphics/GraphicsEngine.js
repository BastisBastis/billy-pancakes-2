import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OBJExporter} from 'three/examples/jsm/exporters/OBJExporter.js'


import BillyGLTF from '../assets/models/characters/Billy3.glb'
import PlayerModel from "./PlayerModel"

import NavMeshManager from "./NavMeshManager"

import flyer from "../assets/audio/Billys bounce.mp3"

const orbit=false;


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}


export default class GraphicsEngine {
  
  constructor ({
    demo=true
  }) {
    
     
  try {
    
    //const canvas = document.querySelector('#threeCanvas');
    
    const canvas = document.createElement("canvas")
    canvas.style.cssText="position:absolute; top:0; left:0; width:100vw; height:100vh; z-index=1;"
    
    //position:absolute; top:0; left:0; width:100vw; height:100vh; z-index=100"
    document.body.appendChild(canvas)
    
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000)
    
    this.renderer = new THREE.WebGLRenderer({canvas})
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color( 0x87CEFA );
    
    //this.listener= new THREE.AudioListener();
    
    
    if (orbit){
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.renderer.domElement.style.zIndex=10
    }

  this.cameraDistance=18
    
    this.camera.position.y = 10;
    
    this.playerPosition=new THREE.Vector3()
    
    
    
    
    if (orbit)
      this.controls.update()
    
    this.findObstructionRays=[
      new THREE.Raycaster(),
      new THREE.Raycaster(),
      
    ];
    
    
    this.raycaster = new THREE.Raycaster()
    this.objects=[]
    
    //setTimeout(()=>this.export(),2000)
    
    //this.navmeshtest2()
    //this.navMeshManager= new NavMeshManager(this.scene)
    
    if (!demo) {
      
      const listener = new THREE.AudioListener();
    this.camera.add( listener );
    
    const sound = new THREE.Audio( listener );
    this.scene.add(sound)
    
    const audioLoader = new THREE.AudioLoader();
audioLoader.load( flyer, function( buffer ) {
  console.log(JSON.stringify(buffer))
    	sound.setBuffer( buffer );
    	sound.setLoop( true );
    	sound.setVolume( 0.5 );
    	sound.play();
  },
  function ( xhr ) {
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
	});
    console.log(listener.context.resume())
      
      
      
    }
    
    
    
    //this.test()
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
  
  getCanvasPosition(posObj) {
    const pos=new THREE.Vector3(posObj.x,posObj.y,posObj.z)
    
    const dist = this.camera.position.distanceTo(pos)
    
    pos.project(this.camera)
    
    //console.log(pos.z)
    
    return {
      x:pos.z>1?10:pos.x,
      y:pos.y,
      dist:dist
    }
  }
  
  setCameraPosition(x,y,z) {
    this.camera.position.set(x,y,z)
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
  
  test() {
    console.log(this)
    if (this.scene.player)
      console.log(this.scene.player.position)
    setTimeout(()=>this.test(),1000)
  }
  
  destroy() {
    
    this.renderer.domElement.remove()
    this.scene=null;
    this.renderer=null;
    this.camera=null;
    this.objects=null;
    delete this
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
      
      const maxDistance = camPos.distanceTo(playerPos)-0.2
      
      this.findObstructionRays[0].set(camPos,dir1)
      this.findObstructionRays[1].set(camPos,dir2)
      
      this.objects.forEach(obj=>{
        obj.testObstruction(this.findObstructionRays,maxDistance)
      })
    }
      
      
    
    if (!orbit && data.player)
      this.updateCameraPosition(data.player)
    
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}