import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/Platform1.glb"

import LevelObjectGraphics from "./LevelObject"

export default class Platform1Graphics extends LevelObjectGraphics {
    constructor(graphicsEngine, position, rotation,scale={xz:1, y:1}) {
      
        super(
          graphicsEngine,
          position,
          rotation,
          scale,
          gltfURL,
          8,
          (gltf)=>{
            var newMaterial = new THREE.MeshPhongMaterial({
              color: 0x252530,
              //color:0x0000ff,
              metalness:0.1, 
              flatShading:true
            });
            this.meshes.forEach(mesh=>{
              mesh.material=newMaterial
            })
          }
        )
      /*
        graphicsEngine.addObject(this);
        this.meshes=[]
        this.loadModel(graphicsEngine.scene, position, rotation, scale);
        
        this.hideCounter =0;
      */
    }

    jloadModel(scene,position,rotation, scale) {
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

                /*
                let bbox = new THREE.Box3().setFromObject(gltf.scene);
                let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
                helper.position.set(position.x, position.y, position.z)
                let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
                scene.add(helper);
                console.log(size)
                */

                gltf.scene.scale.set(8*scale.xz,8*scale.y,8*scale.xz)
                gltf.scene.position.set(position.x,position.y+4*scale.y,position.z)
                gltf.scene.rotation.y=rotation
                var newMaterial = new THREE.MeshStandardMaterial({color: 0x252530,metalness:0.1, flatShading:true});
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    this.meshes.push(object)
                    object.geometry.computeVertexNormals()
                    object.castShadow=true;
                    object.receiveShadow=true;
                    object.material=newMaterial
                  }
                })
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
      /*
    jtestObstruction(raycasters,maxDistance) {
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
          mesh.material.opacity=0.5;
          
          
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
    
    set jposition(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
    
    */
}