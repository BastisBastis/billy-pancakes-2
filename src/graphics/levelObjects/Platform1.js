import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gltfURL from "../../assets/models/objects/Platform1.glb"

export default class Platform1Graphics {
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

                /*
                let bbox = new THREE.Box3().setFromObject(gltf.scene);
                let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
                helper.position.set(position.x, position.y, position.z)
                let size = bbox.getSize(new THREE.Vector3()); // HEREyou get the size
                scene.add(helper);
                console.log(size)
                */

                gltf.scene.scale.set(6*scale.xz,6*scale.y,6*scale.xz)
                gltf.scene.position.set(position.x,position.y+3*scale.y,position.z)
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