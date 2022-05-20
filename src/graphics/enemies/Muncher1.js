import * as THREE from "three"
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

//models
import gltfURL from '../../assets/models/characters/cm2.glb'
//import gltfURL from '../../assets/models/characters/Billy1.glb'

export default class Muncher1Graphics {
  constructor(
    graphicsEngine,
    position,
    rotation
  ) {
    this.xDiff=0.6
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
                gltf.scene.position.set(position.x,position.y+itemScale*size.y*scale.y/2-0.5,position.z)
                gltf.scene.rotation.y=rotation+Math.PI/2
                
                gltf.scene.translateY(20)
                
                //var newMaterial = new THREE.MeshStandardMaterial({color: 0xba8c63,metalness:0, flatShading:true});
                gltf.scene.traverse(object=>{
                  if (object.isMesh) {
                    object.geometry.computeVertexNormals()
                    object.castShadow=true;
                    object.receiveShadow=true;
                    //object.material=newMaterial
                    object.material.roughness=1;
                    object.material.metalness=0.3
                    //console.log(object.material)
                  }
                })
                
                this.mixer=new THREE.AnimationMixer(gltf.scene)
        this.anim=this.mixer.clipAction(gltf.animations[0])
          this.anim.play()
          
                
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
    //console.log(this.model.scene.quaternion)
    if (this.model)
      this.model.scene.rotation.y=-value.y
  }
  
  get rotation() {
    if (this.model) {
      return {
        x:this.model.scene.rotation.x,
        y:this.model.scene.rotation.y,
        z:this.model.scene.rotation.z
      }
    } else {
      return {x:0,y:0,x:0}
    }
  }
  
  lerpRotation(rotation,alpha) {
    if (this.model) {
      const v=new THREE.Vector3(rotation.x,rotation.y,rotation.z)
      //console.log(rotation)
      const euler = new THREE.Euler(rotation.x,rotation.y,rotation.z,"XYZ")
      
      const targetQuat=new THREE.Quaternion().setFromEuler(euler);
      this.model.scene.rotation.setFromQuaternion(targetQuat,"XYZ")
      
      
      return false
      /*
      
      
      //this.model.scene
      this.model.scene.quaternion.rotateTowards(targetQuat,0.01)
      //const newQuaternion= new THREE.Quaternion().slerpQuaternions(this.model.scene.quaternion,targetQuat,alpha).normalize()
      //console.log(newQuaternion)
      //this.model.scene.rotation.setFromQuaternion(newQuaternion,"XYZ")
      */
    }
  }
  
  set position(value){
    if (this.model) {
      this.model.scene.position.x=value.x
    this.model.scene.position.y=value.y+this.height/2-0.5
    this.model.scene.position.z=value.z
    }
    this.model.scene.translateZ(0.6)
    this.model.scene.translateX(-0.5)
  }
  
  update(delta) {
    
    if (this.mixer) {
      
      this.mixer.update( delta/1000 );
    }
  }
}