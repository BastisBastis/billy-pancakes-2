import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import BillyGLTF from '../assets/models/characters/Billy7.glb'


export default class PlayerModel {
  constructor ({
    graphicsEngine,
    position=new THREE.Vector3(0,0,0),
    rotation=0,
    onLoaded=()=> false
  }) {
    
    
    this.loadModel(graphicsEngine.scene,position,rotation)
    
    this._isRunning=false;
    
  }
  
  get isRunning() {
    return this._isRunning;
  }
  
  set isRunning(value) {
    this._isRunning=value;
    if (this.animations) {
      
      if (value){
        this.animations.idle.stop()
        this.animations.walk.play()
      }
        
      else {
        this.animations.walk.stop()
        this.animations.idle.play()
      }
        
    }
  }
  
  stopAnimations(){
    this.animations.forEach((animation)=>{
      animation.stop()
    })
  }
  
  jump() {
    
    this.animations.jump.reset()
    this.animations.idle.stop()
    if (this.isRunning) {
      this.animations.walk.stop()
      
    }
    this.animations.jump.play()
    
    
    
    
    
  }
  
loadModel(scene,position,rotation) {
    const loader = new GLTFLoader();



    // Load a glTF resource
    loader.load(
    	// resource URL
    	BillyGLTF,
    	// called when the resource is loaded
    	 ( gltf ) =>{
    	  try { 
         this.model=gltf
    		scene.add( gltf.scene );
         gltf.scene.scale.set(100,100,100)
    		
    		gltf.scene.position.set(position.x,position.y,position.z)
    		gltf.scene.rotation.y=rotation
    		
    		//gltf.scene.children[0].translateX(-0.005)
    		//gltf.scene.children[0].translateY(-0.0095)
    		//gltf.scene.children[0].translateZ(-0.008)
    		
    		const colors={
    		  "ArmL":0x006600,
    		  "ArmR":0x006600,
    		  "LegL":0x006600,
    		  "LegR":0x006600,
    		  "Body":0x006600,
    		  "HandL":0xcccc00,
    		  "HandR":0xcccc00,
    		  "Neck":0xcccc00,
    		  "Head":0xcccc00,
    		  "FootR":0x000000,
    		}
    		gltf.scene.traverse((object) => {
          const material = object.material;
          
          if (material) {
            
            object.material=new THREE.MeshPhongMaterial( { color: colors[object.userData.name] } );
          }
          
        });
                console.log(gltf.animations.length)
        
        this.mixer=new THREE.AnimationMixer(gltf.scene)
        this.animations={
          idle:this.mixer.clipAction(gltf.animations[0]),
          jump:this.mixer.clipAction(gltf.animations[1]),
          pickup:this.mixer.clipAction(gltf.animations[2]),
          run:this.mixer.clipAction(gltf.animations[3]),
          walk:this.mixer.clipAction(gltf.animations[4]),
        }
        this.animations.idle.play()
        //this.animations.idle.stop()
        
        this.animations.jump.setLoop(THREE.LoopOnce)
        this.animations.jump.setEffectiveTimeScale(0.65)
        
        
    		
        } catch (er) {console.log(er.message)} 
    	},
    	// called while loading is progressing
    	function ( xhr ) {
    
    		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
    	},
    	// called when loading has errors
    	function ( error ) {
    
    		console.log( 'An error happened' );
    
    	}
    );
  }
  
  update(delta,data) {
    if (this.model) {
      this.model.scene.position.set(data.x,data.y,data.z);
    this.model.scene.rotation.y=-data.rotation + Math.PI/2
    }
    
    if (this.mixer) {
      
      this.mixer.update( delta/1000 );
    }
  }
}









/*
export default class PlayerModel {
  constructor ({
    scene,
    position=new THREE.Vector3(0,0,0),
    onLoaded=()=> false
  }) {
    
    this.loadModel(scene)
    
  }
  
loadModel(scene) {
    const loader = new GLTFLoader();



    // Load a glTF resource
    loader.load(
    	// resource URL
    	BillyGLTF,
    	// called when the resource is loaded
    	 ( gltf ) =>{
    	  try { 
         this.model=gltf
    		scene.add( gltf.scene );
         gltf.scene.scale.set(100,100,100)
    		gltf.animations; // Array<THREE.AnimationClip>
    		gltf.scene; // THREE.Group
    		gltf.scenes; // Array<THREE.Group>
    		gltf.cameras; // Array<THREE.Camera>
    		gltf.asset; // Object
    		
    		gltf.scene.children[0].translateX(-0.006)
    		gltf.scene.children[0].translateY(-0.006)
    		gltf.scene.children[0].translateZ(-0.006)
    		
    		const colors={
    		  "ArmL":0x006600,
    		  "ArmR":0x006600,
    		  "LegL":0x006600,
    		  "LegR":0x006600,
    		  "Body":0x006600,
    		  "HandL":0xcccc00,
    		  "HandR":0xcccc00,
    		  "Neck":0xcccc00,
    		  "Head":0xcccc00,
    		  "FootR":0x000000,
    		}
    		gltf.scene.traverse((object) => {
          const material = object.material;
          
          if (material) {
            
            object.material=new THREE.MeshPhongMaterial( { color: colors[object.userData.name] } );
          }
          
        });
        
        
        this.mixer=new THREE.AnimationMixer(gltf.scene)
        this.animations={
          idle:this.mixer.clipAction(gltf.animations[0]),
          jump:this.mixer.clipAction(gltf.animations[1]),
          walk:this.mixer.clipAction(gltf.animations[2]),
        }
        this.animations.walk.play()
        
        
        
    		
        } catch (er) {console.log(er.message)} 
    	},
    	// called while loading is progressing
    	function ( xhr ) {
    
    		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
    	},
    	// called when loading has errors
    	function ( error ) {
    
    		console.log( 'An error happened' );
    
    	}
    );
  }
  
  update(delta,data) {
    if (this.model) {
      this.model.scene.position.set(data.x,data.y,data.z);
    this.model.scene.rotation.y=-data.rotation + Math.PI/2
    }
    
    if (this.mixer) {
      
      this.mixer.update( delta/1000 );
    }
  }
}
*/