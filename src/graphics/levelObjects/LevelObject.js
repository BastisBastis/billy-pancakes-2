import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class LevelObjectGraphics {
    constructor(graphicsEngine, position, rotation,scale, gltfURL,itemScale,onLoad) {
      
        graphicsEngine.addObject(this);
        this.meshes=[]
        this.loadModel(graphicsEngine.scene, position, rotation, scale,gltfURL,itemScale,onLoad);
        
        this.hideCounter =0;
        
    }

    loadModel(scene,position,rotation, scale,gltfURL,itemScale,onLoad) {
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

                //console.log(gltfURL)
                let bbox = new THREE.Box3().setFromObject(gltf.scene);
                
                let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
                
                
                

                gltf.scene.scale.set(itemScale*scale.xz,itemScale*scale.y,itemScale*scale.xz)
                gltf.scene.position.set(position.x,position.y+size.y/2*itemScale*scale.y,position.z)
                gltf.scene.rotation.y=rotation
                
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    this.meshes.push(object)
                    object.geometry.computeVertexNormals()
                    object.castShadow=true;
                    object.receiveShadow=true;
                  }
                })
                onLoad(gltf)
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
        
        
        this.meshes.forEach(mesh=>{
          mesh.material.transparent=true
          mesh.material.opacity=0.3;
          
        })
      } else {
        
        if (this.hideCounter>0) {
          this.hideCounter--;
          if (this.hideCounter==0) {
            this.meshes.forEach(mesh=>{
          mesh.material.opacity=1;
          mesh.material.transparent=false
          
        })
          }
        }
      }
        
      }
      
      
    }
    
    set position(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
}