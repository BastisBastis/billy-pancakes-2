import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/Pallet1.glb"

export default class Pallet1Graphics {
    constructor(scene, position, rotation,scale={xz:1, y:1}) {
        this.loadModel(scene, position, rotation, scale, scale);
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
                const itemScale=3;
                
                gltf.scene.scale.set(itemScale*scale.xz,itemScale*scale.y,itemScale*scale.xz)
                gltf.scene.position.set(position.x,position.y+itemScale*size.y*scale.y/2,position.z)
                gltf.scene.rotation.y=rotation
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
    
    set position(position) {
        this.model.scene.position.set(position.x, position.y, position.z);
    }
}