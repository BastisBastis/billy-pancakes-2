import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/Ramp.glb"



export default class RampGraphics {
    constructor(
      graphicsEngine, 
      position, 
      rotation,
      scale={xz:1, y:1},
      onLoad
    ) {
      
      this.meshes=[]
      this.hideCounter=0
      
        graphicsEngine.addObject(this);
        this.loadModel(graphicsEngine.scene, position, rotation, scale,onLoad);
    }

    loadModel(scene,position,rotation, scale,onLoad) {
        const loader = new GLTFLoader();
        // Load a glTF resource
        loader.load(
            // resource URL
            gltfURL,
            // called when the resource is loaded
             ( gltf ) =>{
              try { 
             this.model=gltf
                scene.add( gltf.scene );

                
                let bbox = new THREE.Box3().setFromObject(gltf.scene);
                //let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
                //helper.position.set(position.x, position.y, position.z)
                let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
                //scene.add(helper);
                //console.log(size)
                const itemScaleXz=8;
                const itemScaleY=7.5;
                
                gltf.scene.scale.set(itemScaleXz*scale.xz,itemScaleY*scale.y,itemScaleXz*scale.xz)
                gltf.scene.position.set(position.x,position.y+itemScaleY*size.y*scale.y/2,position.z)
                gltf.scene.rotation.y=rotation
                
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    this.meshes.push(object)
                    object.castShadow=true;
                    object.receiveShadow=true;
                  }
                })
                
              onLoad()
                
            } catch (er) {console.log(er.message)} 
            },
            // called while loading is progressing
            function ( xhr ) {
                //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
      }
    
    testObstruction(raycasters,maxDistance) {
      try { 
      
      if (this.model) {
        let obstructionCount=0;
        raycasters.forEach((ray,i)=>{
          const rayHits=ray.intersectObjects(this.meshes)
          
          
          
          rayHits.forEach(rayHit=>{
            
            obstructionCount+=rayHit.distance<maxDistance?1:0;
          })
        })
        
      if (obstructionCount>0) {
        this.hideCounter=2;
        
        //console.log(this.meshes.length)
        
        this.meshes.forEach(mesh=>{
          //console.log("hufe")
          mesh.material.transparent=true
          mesh.material.opacity=0.3;
          //mesh.material.color=0x00ffff
          mesh.material.needsUpdate=true
          //console.log(mesh.material.color)
          
        })
      } else {
        
        if (this.hideCounter>0) {
          this.hideCounter--;
          if (this.hideCounter==0) {
            this.meshes.forEach(mesh=>{
          mesh.material.opacity=1;
          mesh.material.transparent=false
          mesh.material.needsUpdate=true
          
        })
          }
        }
      }
        
      }
      
      } catch (er) {console.log(er.message)} 
    }
    
    
    set position(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
}