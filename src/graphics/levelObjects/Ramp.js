import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/Ramp.glb"

export default class RampGraphics {
    constructor(graphicsEngine, position, rotation,scale={xz:1, y:1}) {
      
        graphicsEngine.addObject(this);
        this.loadModel(graphicsEngine.scene, position, rotation, scale);
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
                const itemScaleXz=8;
                const itemScaleY=7.5;
                
                gltf.scene.scale.set(itemScaleXz*scale.xz,itemScaleY*scale.y,itemScaleXz*scale.xz)
                gltf.scene.position.set(position.x,position.y+itemScaleY*size.y*scale.y/2,position.z)
                gltf.scene.rotation.y=rotation
                
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    object.castShadow=true;
                    object.receiveShadow=true;
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
    
    testObstruction(raycaster) {
          
    }
    
    
    set position(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
}