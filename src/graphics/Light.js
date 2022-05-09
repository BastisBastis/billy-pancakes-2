import * as THREE from "three"

const castShadow=true;

export default class Light {
  
  
  
  static addLight({
    scene,
    lightType,
    options
  }) {
    if (lightType==="directional") {
      const light = new THREE.DirectionalLight( 
        options.color||0xffffff, 
        options.intensity ||1
      );
      light.position.set(
        -options.direction.x,
        -options.direction.y,
        -options.direction.z
      )
      light.castShadow=castShadow
      
      light.shadow.camera.top = 80;
      light.shadow.camera.bottom = - 80;
      light.shadow.camera.left = - 80;
      light.shadow.camera.right = 80;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 300;
      
      
      
      scene.add( light );
    } else if (lightType==="point") {
      const light = new THREE.PointLight( 
        options.color||0xffffff,
        options.intensity|| 1,
        options.distance|| 1000 );
        light.position.set( 
          options.position.x,
          options.position.y,
          options.position.z
        );
      light.castShadow=castShadow
      scene.add( light );
      
      
      light.shadow.mapSize.width = 1024; // default
      light.shadow.mapSize.height = 1024; // default
      light.shadow.camera.near = 0.1; // default
      light.shadow.camera.far = 200
      light.frustumCulled=false;
      //light.shadow.bias=0.01
      const helper = new THREE.PointLightHelper(light);
      scene.add(helper);
      
    } else if (lightType==="ambient") {
      const light = new THREE.AmbientLight( options.color||0x808080 ); 
      scene.add( light );
    } else {
      console.log("Light type not found: "+type)
    }
  }
  
}