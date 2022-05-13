import Light from "../graphics/Light"

import Wall from "./levelObjects/Wall"
import Floor from "./levelObjects/Floor"

//Level objects
import Platform1 from "./levelObjects/Platform1"
import Pallet1 from "./levelObjects/Pallet1"
import PalletStack from "./levelObjects/PalletStack"
import Ramp from "./levelObjects/Ramp"

//Enemies
import Muncher1 from "./enemies/Muncher1"

const objectTypes={
  platform:Platform1,
  pallet:Pallet1,
  palletStack:PalletStack,
  ramp:Ramp
}

export default class Level {
  
  constructor({
    graphicsEngine,
    physicsEngine,
    size,
    objects,
    lighting,
    playerStartPosition,
    playerStartRotation
  }) {
    this.graphicsEngine=graphicsEngine;
    this.physicsEngine=physicsEngine;
    
    //Setup room
    this.setupFloor(size)
    this.setupWalls(size)
    
    //objects
    this.setupObjects(objects)
    
    this.setupLighting(lighting)
    
    this.playerStartPosition=playerStartPosition;
    this.playerStartRotation=playerStartRotation;
    
    this.enemies=[
      new Muncher1({
        graphicsEngine:graphicsEngine,
        physicsEngine:physicsEngine,
        position:{x:34,y:0,z:0},
        rotation:0
      })
    ]
  }
  
  setupWalls(size) {
    const northWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:size.x,y:size.y},
      position:{x:0,y:0,z:size.z/2},
      rotation:Math.PI
    })
    const southWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:size.x,y:size.y},
      position:{x:0,y:0,z:-size.z/2},
      rotation:0
    })
    const westWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:size.z,y:size.y},
      position:{x:-size.x/2,y:0,z:0},
      rotation:Math.PI/2
    })
    const eastWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:size.z,y:size.y},
      position:{x:size.x/2,y:0,z:0},
      rotation:-Math.PI/2
    })
  }
  
  setupFloor(size) {
    const floor= new Floor({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{x:size.x,z:size.z},
      position:{x:0,y:0,z:0}
    })
  }
  
  setupObjects(objects) {
    objects.forEach(object=>{
      if (Object.keys(objectTypes).includes(object.type)) {
        /*
        new objectTypes[object.type]({
          graphicsScene:this.graphicsEngine.scene,
          physicsWorld:this.physicsEngine.world,
          position:object.position,
          rotation:object.rotation,
          scale:object.scale
        })
        */
        
        new objectTypes[object.type]({
          graphicsScene:this.graphicsEngine,
          physicsWorld:this.physicsEngine.world,
          ...object
        })
        
      } else {
        console.log("Object type "+object.type+" not found")
      }
    })
  }
  
  setupLighting(lights) {
    lights.forEach(light=>{
      
      Light.addLight({
        scene:this.graphicsEngine.scene,
        lightType:light.type,
        options:light.options
      })
    })
  }
  
  static testLevel(graphicsEngine,physicsEngine) {
    return new Level({
      graphicsEngine:graphicsEngine,
      physicsEngine:physicsEngine,
      size:{x:128,y:32,z:80},
      objects:[
        {
          type:"platform",
          position:{x:0,y:0,z:12},
          scale:{xz:1,y:0.5},
          rotation:0
        },
        {
          type:"platform",
          position:{x:0,y:0,z:20},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:0,y:0,z:28},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:0,y:8,z:28},
          scale:{xz:1,y:0.5},
          rotation:0
        },
        {
          type:"platform",
          position:{x:0,y:0,z:36},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:0,y:8,z:36},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:16,y:0,z:36},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:16,y:8,z:36},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"palletStack",
          position:{x:-25,y:0,z:-14},
          scale:{xz:1,y:1},
          rotation:2,
          count:2
        },
        {
          type:"palletStack",
          position:{x:8,y:0,z:24},
          scale:{xz:1,y:1},
          rotation:0,
          count:4
        },
        {
          type:"palletStack",
          position:{x:12,y:0,z:28},
          scale:{xz:1,y:1},
          rotation:0,
          count:9
        },
        {
          type:"ramp",
          position:{x:0,y:0,z:4},
          scale:{xz:1,y:1},
          rotation:-Math.PI/2,
        },
        {
          type:"ramp",
          position:{x:0,y:4,z:12},
          scale:{xz:1,y:1},
          rotation:-Math.PI/2,
        },
        {
          type:"ramp",
          position:{x:0,y:8,z:20},
          rotation:-Math.PI/2,
        },
      ],
      lighting:[
        {
          type:"ambient",
          options:{
            //color:0xdddddd
            color:0x707070
          }
        },/*
        {
          type:"directional",
          options:{
            color:0x606050,
            direction:{
              x:0,
              y:-40,
              z:-10
            },
            intensity:1
          }
        },
        */
        {
          type:"point",
          options:{
            //color:0xffffff,
            color:0x707060,
            position:{
              x:10,
              y:30,
              z:-15
            }
          }
        }
        
        
      ],
      playerStartPosition:{x:0,y:0,z:0},
      playerStartRotation:Math.PI/4
    })
  }
  
}
