const Levels=[
  
  { //Level 1
    size:{x:10,y:4,z:8},
    objects:[
      {
        type:"palletStack",
        position:{x:4,y:0,z:2},
        scale:{xz:1,y:1},
        rotation:2,
        count:4
      },
      {
        type:"palletStack",
        position:{x:6,y:0,z:6},
        scale:{xz:1,y:1},
        rotation:1.5,
        count:5
      },
      {
        type:"palletStack",
        position:{x:7,y:0,z:1},
        scale:{xz:1,y:1},
        rotation:1.5,
        rotationRandomness:0.4,
        count:12
      },
      {
        type:"palletStack",
        position:{x:1,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:2.2,
        count:9
      },
      
      {
        type:"trap1",
        position:{x:8,y:0,z:5},
      },
      
    ],
    lighting:[
      {
        type:"ambient",
        options:{
          //color:0xdddddd
          color:0x707070
        }
      },
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
    playerStartRotation:0,
    enemies:[
        {
          position:{x:6.1,y:0,z:1.1},
          rotation:1,
        }
    ],
    labels:[
      {
        string:"The rabid carrot munchers are drawn to the smell of carrots and Billy just reeks of it.",
        start:1000,
        duration:6500
      }, 
      {
        string:"Billy must try to lure the muncher into the green muncher trap with his scent.",
        start:8000,
        duration:8500
      },
      {
        string:"But don’t let the rabid carrot muncher chew on him too much. Billy can only handle so much rabies.",
        start:17000,
        duration:9000
      },
      {
        mouseOnly:true,
        string:"Move Billy by using the W, A, S & D keys. Click once to enable turning by moving the mouse.",
        start:26500,
        duration:8000
      },
      {
        touchOnly:true,
        string:"Move Billy by touching and dragging on the screen.",
        start:27500,
        duration:8000
      },
    ]
  },
  
  
  
  
  { //Level 2
    size:{x:10,y:4,z:5},
    objects:[
      
      {
        type:"palletStack",
        position:{x:4,y:0,z:4},
        scale:{xz:1,y:1},
        rotation:2,
        count:4
      },
      {
        type:"palletStack",
        position:{x:8,y:0,z:1},
        scale:{xz:1,y:1},
        rotation:10,
        rotationRandomness:0.5,
        count:7
      },
      {
        type:"palletStack",
        position:{x:9,y:0,z:0},
        scale:{xz:1,y:1},
        rotation:10,
        rotationRandomness:0.5,
        count:14
      },
      {
        type:"palletStack",
        position:{x:1,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:2.2,
        count:9
      },
      
      
       {
        type:"platform",
        position:{x:9,y:0,z:2},
        rotation:0,
        scale:{xz:1,y:1}
      },
      {
        type:"platform",
        position:{x:7 ,y:0,z:2},
        rotation:0,
        scale:{xz:1,y:1}
      },
      {
        type:"platform",
        position:{x:6 ,y:0,z:2},
        rotation:0,
        scale:{xz:1,y:1}
      },
      {
        type:"platform",
        position:{x:5 ,y:0,z:2},
        rotation:0,
        scale:{xz:1,y:0.5}
      },
      {
        type:"ramp",
        position:{x:5 ,y:0.5,z:2},
        rotation:0,
        scale:{xz:1,y:1}
      },
      {
        type:"ramp",
        position:{x:4 ,y:0,z:2},
        rotation:0,
        scale:{xz:1,y:1}
      },
      {
        type:"trap1",
        position:{x:9,y:1,z:2},
      },
      
    ],
    lighting:[
      {
        type:"ambient",
        options:{
          //color:0xdddddd
          color:0x707070
        }
      },
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
    playerStartRotation:Math.PI/4,
    enemies:[
        {
          position:{x:0.1,y:0,z:1.1},
          rotation:1,
        }
      ],
    labels:[
      {
        string:"Sometimes Billy has to give the Munchers a little kick.",
        start:1000,
        duration:5000
      }, 
      {
        string:"Click the mouse to make Billy kick.",
        start:5500,
        duration:5000,
        mouseOnly:true
      }, 
      {
        string:"Hold on the screen while tapping in the bottom half with another finger to make Billy kick.",
        start:5500,
        duration:6500,
        touchOnly:true
      }, 
    ]
  },
  
  
  
  
  
  { //Level 3
    size:{x:10,y:4,z:4},
    objects:[
      {
        type:"palletStack",
        position:{x:3,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:2,
        count:6
      },
      {
        type:"palletStack",
        position:{x:5,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:1.5,
        count:5
      },
      {
        type:"palletStack",
        position:{x:7,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:1.5,
        rotationRandomness:0.4,
        count:10
      },
      {
        type:"palletStack",
        position:{x:9,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:2.2,
        count:9
      },
      {
        type:"carrotBarrel",
        position:{x:5,y:0,z:0}
      },
      
      {
        type:"trap1",
        position:{x:8,y:0,z:1},
      },
      
    ],
    lighting:[
      {
        type:"ambient",
        options:{
          //color:0xdddddd
          color:0x707070
        }
      },
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
    playerStartPosition:{x:1.5,y:0,z:4},
    playerStartRotation:-Math.PI*0.3,
    enemies:[
        {
          position:{x:1.1,y:0,z:0.1},
          rotation:1,
        }
      ],
    labels:[
      {
        string:"Rabid Carrot Munchers love carrots even more than Billy loves scrap booking.",
        start:1000,
        duration:6000
      }, 
      {
        string:"Don’t let it get the Muncher get to close to the carrot barrel or there might not be any carrots left to sell tomorrow!",
        start:6500,
        duration:6500,
      }, 
    ]
  },
  
  
  { //Level 3
    size:{x:9,y:4,z:5},
    objects:[
      {
        type:"palletStack",
        position:{x:2,y:0,z:4},
        scale:{xz:1,y:1},
        rotation:2,
        count:4
      },
      {
        type:"palletStack",
        position:{x:5,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:1.5,
        count:5
      },
      {
        type:"palletStack",
        position:{x:5,y:0,z:4},
        scale:{xz:1,y:1},
        rotation:1.5,
        rotationRandomness:0.4,
        count:12
      },
      {
        type:"palletStack",
        position:{x:1,y:0,z:3},
        scale:{xz:1,y:1},
        rotation:2.2,
        count:9
      },
      {
        type:"palletWall",
        position:{x:4,y:0,z:4},
        count:8
      },
      {
        type:"palletWall",
        position:{x:4,y:0,z:3},
        count:4
      },
      {
        type:"carrotBarrel",
        position:{x:4,y:0,z:1}
      },
      {
        type:"trap1",
        position:{x:7,y:0,z:3},
      },
      
    ],
    lighting:[
      {
        type:"ambient",
        options:{
          //color:0xdddddd
          color:0x707070
        }
      },
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
    playerStartPosition:{x:2,y:0,z:1},
    playerStartRotation:0,
    enemies:[
        {
          position:{x:0.1,y:0,z:4.1},
          rotation:0,
        }
      ],
    labels:[
      {
        string:"If a Muncher is eating from a carrot barrel, simple have Billy give the little one a kick in the right direction.",
        start:1000,
        duration:6500
      }, 
    ]
  },
  
  
  
  { //Level 5
    size:{x:10,y:4,z:5},
    objects:[
      
      {
        type:"platform",
        position:{x:4,y:0,z:4},
        rotation:0,
        scale:{xz:1,y:1},
        
      },
      {
        type:"platform",
        position:{x:5,y:0,z:4},
        rotation:0,
        scale:{xz:1,y:1},
        
      },
      {
        type:"platform",
        position:{x:3,y:0,z:4},
        rotation:0,
        scale:{xz:1,y:1},
        
      },
      {
        type:"platform",
        position:{x:2,y:0,z:4},
        rotation:0,
        scale:{xz:1,y:1},
        
      },
      {
        type:"platform",
        position:{x:6,y:0,z:4},
        rotation:0,
        scale:{xz:1,y:1},
        
      },
      
      {
        type:"trap1",
        position:{x:9,y:0,z:2},
      },
      
      {
        type:"carrotBarrel",
        position:{x:5,y:0,z:2}
      }
      
    ],
    lighting:[
      {
        type:"ambient",
        options:{
          //color:0xdddddd
          color:0x707070
        }
      },
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
    playerStartPosition:{x:9,y:0,z:1},
    playerStartRotation:Math.PI,
    enemies:[
        {
          position:{x:0.1,y:0,z:1.1},
          rotation:1,
        },
        {
          position:{x:0.1,y:0,z:4.1},
          rotation:1,
        }
      ],
    labels:[
      {
        string:"Sometimes you can feel a bit outnumbered.",
        start:1000,
        duration:4000
      }, 
      {
        string:"Like when Billy’s divorce laywer took his wifes side.",
        start:5500,
        duration:4000,
      }, 
      
    ]
  },
  
  
  { //Test level
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
          type:"palletWall",
          position:{x:5,y:0,z:8},
          scale:{xz:1,y:1},
          rotation:0,
          count:12
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
        },/*
        {
          type:"carrotBarrel",
          position:{x:2,y:0,z:4},
        },*/
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
      playerStartRotation:Math.PI/4,
      enemies:[
        {
          position:{x:4.1,y:0,z:3.2},
          rotation:1,
        },
        
      ],
    labels:[]
  }
  
 
]

export default Levels