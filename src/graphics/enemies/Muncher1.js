import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import gltfURL from '../../assets/models/characters/CarrotMuncher1.glb'
//import gltfURL from '../../assets/models/characters/Billy1.glb'

export default class Muncher1Graphics {
  constructor(
    graphicsEngine,
    position,
    rotation
  ) {
    
  this.loadModel(graphicsEngine.scene, position, rotation, {xz:1,y:1});
    }

    loadModel(scene,position,rotation, scale) {
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
                const itemScale=4;
                this.height=itemScale*size.y*scale.y/2
                
                gltf.scene.scale.set(itemScale*scale.xz,itemScale*scale.y,itemScale*scale.xz)
                gltf.scene.position.set(position.x,position.y+itemScale*size.y*scale.y/2,position.z)
                gltf.scene.rotation.y=rotation+Math.PI/2
                //var newMaterial = new THREE.MeshStandardMaterial({color: 0xba8c63,metalness:0, flatShading:true});
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    object.geometry.computeVertexNormals()
                    object.castShadow=true;
                    object.receiveShadow=true;
                    //object.material=newMaterial
                    //object.material.roughness=0.6;
                    //object.material.emissive=0x00ff00
                    //console.log(object.material)
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
  set rotation(value) {
    this.model.scene.rotation.y=-value
  }
  
  set position(value){
    this.model.scene.position.x=value.x
    this.model.scene.position.y=value.y+this.height/2
    this.model.scene.position.z=value.z
  }
}