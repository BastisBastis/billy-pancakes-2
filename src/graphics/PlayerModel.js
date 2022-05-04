import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import BillyGLTF from '../assets/models/characters/Billy3.glb'

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
  
  update(delta) {
    if (this.mixer) {
      
      this.mixer.update( delta/1000 );
    }
  }
}