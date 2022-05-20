import Light from "../graphics/Light"

import Wall from "./levelObjects/Wall"
import Floor from "./levelObjects/Floor"

//Level objects
import Platform1 from "./levelObjects/Platform1"
import Pallet1 from "./levelObjects/Pallet1"
import PalletStack from "./levelObjects/PalletStack"
import Ramp from "./levelObjects/Ramp"
import Trap1 from "./levelObjects/Trap1"
import CarrotBarrel from "./levelObjects/CarrotBarrel"

//Enemies
import Muncher1 from "./enemies/Muncher1"

import NavMeshManager from "../helpers/NavMeshManager"
import Pathfinder from "../helpers/Pathfinder"

const objectTypes={
  platform:Platform1,
  pallet:Pallet1,
  palletStack:PalletStack,
  ramp:Ramp,
  trap1:Trap1,
  carrotBarrel:CarrotBarrel,
}



export default class Level {
  
  constructor({
    graphicsEngine,
    physicsEngine,
    size,
    objects,
    lighting,
    playerStartPosition,
    playerStartRotation,
    tileSize=8,
    tileHeight=8
  }) {
    this.graphicsEngine=graphicsEngine;
    this.physicsEngine=physicsEngine;
    
    this.tileSize=tileSize
    this.tileHeight=tileHeight
    
    
    
    //Setup room
    this.setupFloor(size)
    this.setupWalls(size)
    
    this.occupiedFloorTiles=[]
    this.itemVertices=[]
    this.attractions=[]
    
    //objects
    
    this.setupObjects(objects)
    
    this.setupLighting(lighting)
    
    this.playerStartPosition={
      x:playerStartPosition.x*this.tileSize,
      y:playerStartPosition.y*this.tileHeight,
      z:playerStartPosition.z*this.tileSize
    };
    this.playerStartRotation=playerStartRotation;
    
    let navVerts=[]
    this.itemVertices.forEach(iv=>
    {
      navVerts=[
        ...navVerts,
        ...iv.vertices
      ]
    })
    
    this.navMesh=NavMeshManager.fromData({
    scene:graphicsEngine.scene,
    occupiedFloorTiles:this.occupiedFloorTiles,
    vertices:navVerts,
    tileSize:tileSize,
    levelSize:size
  })
  this.pathfinder= new Pathfinder(this.navMesh)
  
  
    
    this.enemies=[
      new Muncher1({
        graphicsEngine:graphicsEngine,
        physicsEngine:physicsEngine,
        position:{x:34,y:0,z:30},
        rotation:0,
        pathfinder:this.pathfinder,
        attractions:this.attractions
      })
    ]
  }
  
  setupWalls(size) {
    const w=size.x*this.tileSize;
    const d=size.z*this.tileSize
    const northWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        y:size.y*this.tileHeight},
      position:{
        x:w/2,y:0,
        z:d
      },
      rotation:Math.PI
    })
    const southWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        y:size.y*this.tileHeight
      },
      position:{
        x:w/2,y:0,
        z:0
      },
      rotation:0
    })
    const westWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.z*this.tileSize,
        y:size.y*this.tileHeight
      },
      position:{
        x:0
        ,y:0,z:d/2},
      rotation:Math.PI/2
    })
    const eastWall= new Wall({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.z*this.tileSize,
        y:size.y*this.tileHeight},
      position:{
        x:w,
        y:0,z:d/2},
      rotation:-Math.PI/2
    })
  }
  
  setupFloor(size) {
    const floor= new Floor({
      graphicsScene:this.graphicsEngine.scene,
      physicsWorld:this.physicsEngine.world,
      size:{
        x:size.x*this.tileSize,
        z:size.z*this.tileSize
      },
      position:{
        x:this.tileSize*size.x/2,
        y:0,
        z:this.tileSize*size.z/2
      }
    })
  }
  
  setupObjects(objects) {
    objects.forEach(object=>{
      if (Object.keys(objectTypes).includes(object.type)) {
        
        
        if (object.position){
          object.position.x=(object.position.x+0.5)*this.tileSize
          object.position.y*=this.tileHeight
          object.position.z=(object.position.z+0.5)*this.tileSize
        }
        
        const item=new objectTypes[object.type]({
          graphicsScene:this.graphicsEngine,
          physicsWorld:this.physicsEngine.world,
          ...object
        })
        
        if (item.attraction) {
          this.attractions.push(item);
        }
        
        if (object.position.y===0 && object.type!=="trap1" && object.type!=="carrotBarrel") {
          this.occupiedFloorTiles.push(object.position)
        }
        
        const vertCollections=item.navVertCollections;
        vertCollections.forEach(vc=>{
          const competingVc=this.itemVertices.find(cvc=>{
            return (
              vc.itemPos.x==cvc.itemPos.x &&
              vc.itemPos.z==cvc.itemPos.z &&
              vc.vertY==cvc.vertY
              )
          })
          if (competingVc) {
            if (competingVc.itemPos.y<vc.itemPos.y) {
              
            
              this.itemVertices=[
                ...this.itemVertices.filter(vertc=>vertc!==competingVc),
                vc
              ]
            }
          } else {
            this.itemVertices.push(vc)
          }
          
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
      size:{x:16,y:4,z:10},
      objects:[
        {
          type:"platform",
          position:{x:6,y:0,z:6},
          scale:{xz:1,y:0.5},
          rotation:0
        },
        {
          type:"platform",
          position:{x:6,y:0,z:7},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:6,y:0,z:8},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:6,y:1,z:8},
          scale:{xz:1,y:0.5},
          rotation:0
        },
        {
          type:"platform",
          position:{x:8,y:0,z:9},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:8,y:1,z:9},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:6,y:0,z:9},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"platform",
          position:{x:6,y:1,z:9},
          scale:{xz:1,y:1},
          rotation:0
        },
        {
          type:"palletStack",
          position:{x:4,y:0,z:2},
          scale:{xz:1,y:1},
          rotation:2,
          count:4
        },
        {
          type:"palletStack",
          position:{x:7,y:0,z:8},
          scale:{xz:1,y:1},
          rotation:0,
          count:5
        },
        {
          type:"palletStack",
          position:{x:1,y:0,z:3},
          scale:{xz:1,y:1},
          rotation:0,
          count:9
        },
        {
          type:"ramp",
          position:{x:6,y:0,z:5},
          scale:{xz:1,y:1},
          rotation:-Math.PI/2,
        },
        {
          type:"ramp",
          position:{x:6,y:0.5,z:6},
          scale:{xz:1,y:1},
          rotation:-Math.PI/2,
        },
        {
          type:"ramp",
          position:{x:6,y:1,z:7},
          rotation:-Math.PI/2,
        },
        {
          type:"trap1",
          position:{x:8,y:0,z:3},
        },
        {
          type:"carrotBarrel",
          position:{x:9,y:0,z:6},
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
              z:15
            }
          }
        }
        
        
      ],
      playerStartPosition:{x:2,y:0,z:3},
      playerStartRotation:Math.PI/4
    })
  }
  
}
