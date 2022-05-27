import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/CarrotBarrel1.glb"

import EventCenter from "../../helpers/EventCenter"

import LevelObjectGraphics from "./LevelObject"


export default class CarrotBarrelGraphics {
    constructor(graphicsEngine, position, rotation,scale={xz:1, y:1},index,parent,onLoad=()=>false) {
      
      this.meshes=[]
      this.hideCounter=0
      
      this.graphicsEngine=graphicsEngine
      
        graphicsEngine.addObject(this);
        this.loadModel(graphicsEngine.scene, position, rotation, scale,onLoad);
        this.index=index;
        this.parent=parent;
        this.destroyed=false;
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

                //console.log(1)
                let bbox = new THREE.Box3().setFromObject(gltf.scene);
                //let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
                //helper.position.set(position.x, position.y, position.z)
                let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
                //scene.add(helper);
                //console.log(size,position)
                const itemScale=4;
                this.height=size.y*itemScale
                
                gltf.scene.scale.set(itemScale*scale.xz,itemScale*scale.y,itemScale*scale.xz)
                gltf.scene.position.set(position.x,position.y+itemScale*size.y*scale.y*0.3,position.z)
                gltf.scene.rotation.y=rotation
                //var newMaterial = new THREE.MeshStandardMaterial({color: 0xba8c63,metalness:0, flatShading:true});
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    object.geometry.computeVertexNormals()
                    object.castShadow=true;
                    object.receiveShadow=true;
                    //object.material=newMaterial
                    object.material.roughness=0.9;
                    object.material.metalness=0;
                    this.meshes.push(object)
                    //object.material.emissive=0x00ff00
                    //console.log(object.material)
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
      
  destroy() {
    this.destroyed=true;
    this.model.scene.removeFromParent()
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
  
   get position() {
     return {
       x:this.model.scene.position.x,
       y:this.model.scene.position.y,
       z:this.model.scene.position.z,
     }
   }
    
    set position(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
    
    update(delta) {
      
      if (!this.model || this.destroyed) {
        return false
      }
      
      
      
      const canvasPos=this.graphicsEngine.getCanvasPosition({
        x:this.position.x,
          y:this.position.y+this.height*0.8,
        z:this.position.z
      })
      EventCenter.emit("updateAttractionPosition",{
        index:this.index,
        position:{
          x:canvasPos.x,
          y:canvasPos.y
        },
        distance:canvasPos.dist,
        count:this.parent.carrotCount
      })
    }
}