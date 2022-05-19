import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {OBJExporter} from 'three/examples/jsm/exporters/OBJExporter.js'


import BillyGLTF from '../assets/models/characters/Billy3.glb'
import PlayerModel from "./PlayerModel"

import NavMeshManager from "./NavMeshManager"

const orbit=false;


function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}


export default class GraphicsEngine {
  
  constructor () {
    
     
  try {
    
    const canvas = document.querySelector('#threeCanvas');
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.001,10000)
    
    this.renderer = new THREE.WebGLRenderer({canvas})
    this.renderer.setSize(window.innerWidth,window.innerHeight)
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color( 0x87CEFA );
    
    
    
    
    if (orbit){
      this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      this.renderer.domElement.style.zIndex=10
    }

  this.cameraDistance=18
    
    this.camera.position.y = 10;
    
    this.playerPosition=new THREE.Vector3()
    
    /*
    //temp Floor
    var geo = new THREE.PlaneBufferGeometry(40,40,2,2)
    var material = new THREE.ShaderMaterial({
      uniforms: {
        color1: {
          value: new THREE.Color("black")
        },
        color2: {
          value: new THREE.Color("pink")
        }
      },
      vertexShader: `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
      
        varying vec2 vUv;
        
        void main() {
          
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
      wireframe: false,
      side:2
      
    });
    var mesh = new THREE.Mesh(geo, material);
    mesh.rotation.x=Math.PI/2
    //this.scene.add(mesh)
    
    */
    
    if (orbit)
      this.controls.update()
    
    this.findObstructionRays=[
      new THREE.Raycaster(),
      new THREE.Raycaster(),
      
    ];
    
    
    this.raycaster = new THREE.Raycaster()
    this.objects=[]
    
    //setTimeout(()=>this.export(),2000)
    
    //this.navmeshtest2()
    //this.navMeshManager= new NavMeshManager(this.scene)
    
    } catch (er) {console.log(er.message)}
  }
  /*
  
  navmeshtest2() {
    var plane, vertices = [], planeShape;
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xff00ff});

        vertices.push(
            new THREE.Vector3(-15,-15,0),
            new THREE.Vector3(15,-15,0),
            new THREE.Vector3(15,15,0),
            new THREE.Vector3(-15,15,0)
        );

        planeShape = new THREE.Shape(vertices);

        plane = new THREE.Mesh( new THREE.ShapeGeometry(planeShape), planeMaterial);
        plane.position.y=8

        this.scene.add(plane);

        var holes = [
            new THREE.Vector3(-7,-7,0),
            new THREE.Vector3(7,-7,0),
            new THREE.Vector3(7,7,0),
            new THREE.Vector3(-7,7,0)
        ]

        hole = new THREE.Path();
        hole.fromPoints(holes);

        var shape = new THREE.Shape(plane.geometry.vertices);
        shape.holes = [hole];
        var points = shape.extractPoints();

        plane.geometry.faces = [];

        var triangles = THREE.ShapeUtils.triangulateShape ( points.shape, points.holes );

        plane.geometry.vertices.push(
            new THREE.Vector3(-7,-7,0),
            new THREE.Vector3(7,-7,0),
            new THREE.Vector3(7,7,0),
            new THREE.Vector3(-7,7,0)
        );
        
        
        
        for( var i = 0; i < triangles.length; i++ ){
            plane.geometry.faces.push( new THREE.Face3( triangles[i][0], triangles[i][1], triangles[i][2] ));
        }
  }
  
  navmeshtest() {
    const material=new THREE.MeshLambertMaterial({color:0x00ffaa})
    
    const floorShapePoints=[
      new THREE.Vector2(-20,-12),
      new THREE.Vector2( 4,-12),
      new THREE.Vector2( 4, 4),
      new THREE.Vector2(-4, 4),
      new THREE.Vector2(-4, -4),
      new THREE.Vector2(-20,-4),
    ]
    
    const floorShape= new THREE.Shape(floorShapePoints);
    
    const holePoints=[
      new THREE.Vector2(-2,-2),
      new THREE.Vector2( 0,-2),
      new THREE.Vector2( 0, 0),
      new THREE.Vector2(-2, 0),
    ]
    
    const holeShape=new THREE.Shape(holePoints)
    
    
    
    floorShape.holes.push(holeShape);
    const hole=new THREE.Path()
    hole.fromPoints(holePoints)
    const flSh=new THREE.Shape(floorShapePoints)
    flSh.holes=[hole]
    const pts=flSh.extractPoints()
    
    const verts=THREE.ShapeUtils.triangulateShape(floorShapePoints,[holePoints])
    
    let vs=[]
    
    verts.forEach(v=>{
      vs=[
        ...vs,
        ...v
      ]
    })
    const vertices = new Float32Array( vs );
    
    
    
    const newGeo = new THREE.BufferGeometry()
    newGeo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    
    const m=new THREE.Mesh(newGeo,material)
    
    this.scene.add(m)
    
    
    
    const floorGeo=new THREE.ShapeBufferGeometry(floorShape)
    
    const rampHeight=4;
    const rampLength=Math.sqrt(16+64);
    const rampShape=new THREE.Shape([
      new THREE.Vector2(-4,-rampLength/2),
      new THREE.Vector2( 4,-rampLength/2),
      new THREE.Vector2( 4, rampLength/2),
      new THREE.Vector2(-4, rampLength/2),
    ])
    //const rampGeo=new THREE.PlaneBufferGeometry(8,rampLength,2,2)//new THREE.ShapeBufferGeometry(rampShape)
    //rampGeo.rotateX(26*Math.PI/180)
    //rampGeo.translate(0,8,2)
    
    //floorGeo.merge(rampGeo)
    //THREE.GeometryUtils.merge(floorGeo,rampGeo);
    
    
    
    const tl={x:-4,y:12,z: 4}
    const tr={x: 4,y:12,z: 4}
    const bl={x:-4,y:4 ,z: 0}
    const br={x: 4,y:4 ,z: 0}
    
    const vertices = new Float32Array( [
	 bl.x, bl.y,  bl.z,
	 br.x, br.y,  br.z,
	 tr.x,  tr.y, tr.z,

	 tr.x,  tr.y,  tr.z,
	 tl.x,  tl.y,  tl.z,
	 bl.x,  bl.y,  bl.z
] );

    const rampGeo = new THREE.BufferGeometry
    rampGeo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    
    //floorGeo.merge(rampGeo)
    
    
    const floorMesh=new THREE.Mesh(floorGeo,material);
    rampGeo.computeVertexNormals()
    rampGeo.computeBoundingSphere()
    
    //floorMesh.updateMatrix()
    
    //rampGeo.merge(floorGeo)
    
    const vs = []
    //floorGeo.attributes.copyVector3sArray(vs)
    
   
    
   
    
    
    const rampMesh=new THREE.Mesh(rampGeo,material);
    
    const singleGeo=new THREE.BufferGeometry()
    
    
    
    //singleGeo.merge(floorMesh.geometry)
    //singleGeo.merge(rampMesh.geometry)
    
    const mesh=new THREE.Mesh(rampGeo,material)
    
    mesh.position.x=0
    mesh.position.y=0.1;
    mesh.position.z=-4
    //mesh.rotation.x=-Math.PI/2
    //mesh.rotation.z=-Math.PI
    
    
    
    //mesh.add()
    //mesh.add(rampMesh)
    
    this.navmesh=mesh;
    //this.mesh.rotation.x=Math.PI/2;
    //this.mesh.rotation.y=rotation;
    //this.mesh.receiveShadow=true;
    //this.mesh.position.set(position.x,position.y,position.z)
    this.scene.add(mesh)
    
    //this.export(mesh)
    
    
  }
  
  
  export(mesh) {
    try { 
    const exporter = new OBJExporter()
    download("scene.obj",exporter.parse(mesh))
    
    } catch (er) {console.log(er.message)} 
  }
  */
  addBox(position,size,rotation) {
    const geo = new THREE.BoxBufferGeometry(size.width,size.height,size.depth);
    const mat = new THREE.MeshStandardMaterial({color:"blue",wireframe:true})
    const mesh=new THREE.Mesh(geo,mat);
    mesh.position.x=position.x
    mesh.position.y=position.y+size.height/2;
    mesh.position.z=position.z
    
    mesh.setRotationFromAxisAngle(new THREE.Vector3(0,1,0),rotation)
    
    this.scene.add(mesh)
    
    mesh.setRotation=(rot=>{
      mesh.rotation.y=-rot;
    })
    
    mesh.setPosition=(x,y,z)=>{
      mesh.position.x=x
      mesh.position.y=y+size.height/2
      mesh.position.z=z
    }
    
    return mesh
  }
  
  addObject(obj) {
    this.objects.push(obj)
    
  }
  
  updateCameraPosition(playerData) {
    try { 
    
    this.camera.position.set(
      playerData.position.x-Math.cos(playerData.rotation)*this.cameraDistance,
      playerData.position.y+10,
      playerData.position.z-Math.sin(playerData.rotation)*this.cameraDistance
    )
    
    /*
    this.camera.position.set(
      playerData.position.x-15,
      playerData.position.y+15,
      playerData.position.z-15 
    )
    */
    
    this.camera.lookAt(playerData.position.x,playerData.position.y,playerData.position.z)
    
    
    } catch (er) {console.log(er.message)} 
  }
  
  update(delta,data) {
    if (data.player && this.scene.player) {
      
      const playerPos=this.scene.player.position;
      const camPos=new THREE.Vector3()
      this.camera.getWorldPosition(camPos)
      
      const playerTop=playerPos.y+6;
      const playerBottom=playerPos.y-0;
      
      const playerTarget1=playerPos.clone()
      playerTarget1.y=playerTop;
      
      const playerTarget2=playerPos.clone()
      playerTarget2.y=playerBottom;

      const dir1 = playerTarget1.clone().sub(camPos).normalize()
      
      const dir2 = playerTarget2.clone().sub(camPos).normalize()
      
      const maxDistance = camPos.distanceTo(playerPos)-0.2
      
      this.findObstructionRays[0].set(camPos,dir1)
      this.findObstructionRays[1].set(camPos,dir2)
      
      this.objects.forEach(obj=>{
        obj.testObstruction(this.findObstructionRays,maxDistance)
      })
    }
      
      /*
      this.playerPosition = new THREE.Vector3(data.player.position.x,data.player.position.y,data.player.position.z)
      const playerPos2= new THREE.Vector3()
      this.scene.player.getWorldPosition(playerPos2)
      
    
      const camPos1=this.camera.position
      
      
      
      const dir1 = camPos1.clone().sub(this.playerPosition).normalize()
      const dir2 = this.playerPosition.clone().sub(camPos1).normalize()
      
      const dir3 = camPos2.clone().sub(playerPos2).normalize()
      const dir4 = this.playerPosition.clone().sub(camPos2).normalize()
      
      
      
      const dir5=new THREE.Vector3()
      this.camera.getWorldDirection(dir5)//.normalize()
      
      
      
      const maxDistance = this.camera.position.distanceTo(this.playerPosition)
      //
      
      this.raycaster.set(camPos1,dir2)
      //this.raycaster.set(camWorldPos,camDir)
      
      try { 
      if (this.arrow)
        this.scene.remove ( this.arrow );
        this.arrow = new THREE.ArrowHelper( dir5, this.scene.player.position, 100, Math.random() * 0xffffff );
        this.scene.add( this.arrow );

      } catch (er) {console.log(er.message)} 
      
      this.objects.forEach(obj=>{
        obj.testObstruction(this.raycaster,maxDistance)
      })
    }
    */
    
    if (!orbit)
      this.updateCameraPosition(data.player)
    
    
    this.renderer.render( this.scene, this.camera );
    
  }
  
}