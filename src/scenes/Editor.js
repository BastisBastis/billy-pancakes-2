import Phaser from "phaser"



//Graphics files
import PlayerSheet from "../assets/sprites/player.png"
import BlockSheet from "../assets/sprites/blocks.png"
import Pointer from "../assets/sprites/pointer.png"
import Hand from "../assets/sprites/hand.png"
import Save from "../assets/sprites/save.png"
import ArrowLeft from "../assets/sprites/arrowLeft.png"
import AddColumn from "../assets/sprites/addColumn.png"
import RemoveColumn from "../assets/sprites/removeColumn.png"
import Items from "../assets/sprites/items.png"
import JumperSheet from "../assets/sprites/jumper.png"
import Block2Sheet from "../assets/sprites/blocks2.png"
import AddLevel from "../assets/sprites/addLevel.png"
import RemoveLevel from "../assets/sprites/removeLevel.png"
import PrevLevel from "../assets/sprites/prevLevel.png"
import NextLevel from "../assets/sprites/nextLevel.png"
import StartRow from "../assets/sprites/startRow.png"
import Demo from "../assets/sprites/demo.jpeg"
import EventsIcon from "../assets/sprites/actions.png"

//Level Data
import LevelData from "../assets/levels.json"
import DemoData from "../assets/demoLevel.json"

//Objects
import ItemManager from "../objects/ItemManager"
import GameEvents from "../objects/GameEvents"

const editDemo=false

function saveFile(data){
  const url=editDemo?'http://localhost:3000/demo':'http://localhost:3000/game'
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .then(response => 
          response.text()
        ).then(response=>{
          console.log(response)
        }).catch(error=>{
          console.log(error)
          alert(error)
        });
  }


export default class Game extends Phaser.Scene {
  constructor() {
    super({key:"Game"});
    
    
  }
  
  preload() {
    this.load.spritesheet('player', PlayerSheet, { frameWidth: 250, frameHeight: 250 });
    this.load.spritesheet('blocks', BlockSheet, { frameWidth: 250, frameHeight: 250 });
    this.load.image("pointer",Pointer)
    this.load.image("hand",Hand)
    this.load.image("save",Save)
    this.load.image("arrowLeft",ArrowLeft)
    this.load.image("addColumn",AddColumn)
    this.load.image("removeColumn",RemoveColumn)
    this.load.image("items",Items)
    this.load.image("addLevel",AddLevel)
    this.load.image("removeLevel",RemoveLevel)
    this.load.image("prevLevel",PrevLevel)
    this.load.image("nextLevel",NextLevel)
    this.load.image("startRow",StartRow)
    this.load.image("demo",Demo)
    this.load.image("events",EventsIcon)
    
    this.load.spritesheet('blocks2', Block2Sheet, { frameWidth: 250, frameHeight: 250 });
    this.load.spritesheet('jumper', JumperSheet, { frameWidth: 400, frameHeight: 400 });
  }
  
  create() {
    try {
    
    //Set up camera
    this.cameras.main.setBackgroundColor("#ddddff")
    this.levelIndex=0
    const loadedData=editDemo?DemoData:LevelData
    this.levelData=loadedData.length>0?[...loadedData]:[this.getEmptyLevel()];
    
    /*
    this.levelData.forEach(l=>{
      l.demo=false
      l.events=[]
    })
    */
    
    
    
    this.levelItems=[...this.levelData[this.levelIndex].items]
    
    this.rows=24//this.levelData[this.levelIndex].tiles[0].length;
    this.columns=this.levelData[this.levelIndex].tiles.length;
    this.tileHeight=45;
    this.tileWidth=this.tileHeight;
    this.selectedTool=0;
    this.toolWidth=80;
    this.toolHeight=80;
    this.tileCount=4;
    this.selectedCell=false;
    this.sourceTileWidth=250;
    this.sourceTileHeight=250;
    
    
    
    this.cells=[];
    
    this.populateLevel(this.levelData[this.levelIndex].tiles)
    this.setupTiles()
    
    this.tileMarker=this.add.rectangle(-50,-50,this.tileWidth,this.tileHeight).setOrigin(0,0).setStrokeStyle(2, 0xff0000);
    
    this.cellLabel=this.add.text(220,this.cameras.main.height-100-this.toolHeight*2,"Level Editor", {color:"#000",fontSize:"32px"}).setOrigin(0,0.5).setScrollFactor(0)
    
    this.levelLabel=this.add.text(20,this.cameras.main.height-100-this.toolHeight*2,"Level: "+this.levelIndex, {color:"#000",fontSize:"32px"}).setOrigin(0,0.5).setScrollFactor(0)
    
    this.setupItemWindow();
    
    this.input.on('pointermove', (event)=>{
      if (this.itemWindowObjects[0].visible) {
        return false;
      }
      if (this.selectedTool===6) {
        this.cameras.main.scrollX-=this.input.activePointer.position.x-this.input.activePointer.prevPosition.x;
        //console.log(this.input.activePointer.position.x-this.input.activePointer.prevPosition.x)
      }
    });
    
   
    
    } catch (er) {
      console.log(er.message)
      console.log(er.stack)
    }
  }
  
  switchLevel(delta,save=true){
    try {
      if (save)
      this.writeToLevelData()
    if (this.levelIndex+delta<0 || this.levelIndex+delta >= this.levelData.length) {
      return false;
    }
    this.clear()
    this.levelIndex+=delta;
    this.populateLevel(this.levelData[this.levelIndex].tiles)
    this.levelItems=[...this.levelData[this.levelIndex].items]
    this.levelLabel.text="Level: "+this.levelIndex
    
    this.setupItemWindow()
    } catch (er) {
      console.log(er.message)
      console.log(er.stack)
      }
  }
  
  clear() {
    this.cameras.main.setScroll(0,0)
    this.cells.forEach(col=>{
      col.forEach(cell=>{
        cell.sprite.destroy()
      })
      
    })
    this.cells=[]
    this.selectTool(0)
    this.clearItemWindow()
  }
  
  removeColumn() {
    try {
    if (this.selectedCell) {
      this.cells[this.selectedCell.x].forEach(cell=>cell.sprite.destroy())
      this.cells.splice(this.selectedCell.x,1)
      this.updateColumnPositions()
    }
    } catch(er) {alert(er)}
  }
  
  addColumn() {
    if (!this.selectedCell) {
      return false;
    }
    
    this.levelData[this.levelIndex].events.forEach(e=>{
      if (e.startColumn>this.selectedCell.x) {
        e.startColumn++;
      }
    })
    
    const newColumn=[]
    for (let i=0;i<this.rows;i++) {
      const cell={passable:true,entities:[],tile:0}
      const sprite=this.add.sprite(this.tileWidth*this.selectedCell.x,this.tileHeight*i,"__DEFAULT");
        
      sprite.setDisplaySize(this.tileWidth,this.tileHeight).setOrigin(0,0).setInteractive().on('pointerdown',()=>{
        this.hitCell(this.selectedCell.x,this.selectedCell.y,cell)
      });
      cell.sprite=sprite;
      newColumn.push(cell)
    }
    this.cells.splice(this.selectedCell.x,0,newColumn);
    this.updateColumnPositions()
    this.cameras.main.setBounds(0,0,this.tileWidth*this.cells.length,this.cameras.main.height)
  }
  
  updateColumnPositions() {
    this.cells.forEach((rows,col)=>{
      rows.forEach((cell,row)=>{
        
        cell.sprite.x=col*this.tileWidth;
        cell.sprite.on('pointerdown',()=>{
          this.hitCell(col,row,cell)
        });
      })
    })
  }
  
  populateLevel(cols) {
    
    this.cells=[]
    cols.forEach((rows,col)=>{
      const column=[]
      rows.forEach((cell,row)=>{
        //console.log("i")
        let sprite;
        if (cell.tile>0) {
          
          sprite=this.add.sprite(this.tileWidth*col,this.tileHeight*row,"blocks",cell.tile-1);
          cell.passable=false;
        }
        else {
          sprite=this.add.sprite(this.tileWidth*col,this.tileHeight*row,"__DEFAULT");
        }
        sprite.setDisplaySize(this.tileWidth,this.tileHeight).setOrigin(0,0).setInteractive().on('pointerdown',()=>{
      this.hitCell(col,row,cell)
    });
        cell.sprite=sprite;
        column.push(cell);
      })
      this.cells.push(column)
    })
    this.cameras.main.setBounds(0,0,this.tileWidth*this.cells.length,this.cameras.main.height)
  }
  
  setupTiles() {
    this.add.rectangle(0,this.tileHeight*this.cells[0].length,this.cameras.main.width,this.cameras.main.height-this.tileHeight*this.cells[0].length,0xffffff).setOrigin(0,0).setScrollFactor(0)
    const width=this.toolWidth, height=this.toolHeight;
    this.add.sprite(0,this.cameras.main.height-height,).setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.selectTool(0)
    });
    for (let i =1;i<5;i++) {
      const tile=this.add.sprite(i*width,this.cameras.main.height-height,"blocks",i-1).setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.selectTool(i)
    });
      
    }
    this.add.sprite(5*width,this.cameras.main.height-height,"pointer").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.selectTool(5)
    });
    this.add.sprite(6*width,this.cameras.main.height-height,"hand").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.selectTool(6)
      console.log(this.levelItems)
    });
    this.add.sprite(0*width,this.cameras.main.height-height*2,"save").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.save()
    });
    this.add.sprite(1*width,this.cameras.main.height-height*2,"arrowLeft").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.switchLevel(-1)
    });
    this.add.sprite(2*width,this.cameras.main.height-height*2,"arrowLeft").setDisplaySize(width,height).setOrigin(0,0).setFlip(true,false).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.switchLevel(1)
    });
    this.add.sprite(3*width,this.cameras.main.height-height*2,"addColumn").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.addColumn()
    });
    this.add.sprite(4*width,this.cameras.main.height-height*2,"removeColumn").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.removeColumn()
    });
    this.add.sprite(5*width,this.cameras.main.height-height*2,"items").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.itemWindowObjects.forEach(obj=>{
          obj.visible=true;
        })
    });
    this.add.sprite(6*width,this.cameras.main.height-height*2,"removeLevel").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.removeLevel()
    });
    this.add.sprite(7*width,this.cameras.main.height-height*2,"addLevel").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.addLevel()
    });
    this.add.sprite(8*width,this.cameras.main.height-height*2,"prevLevel").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.moveLevel(-1)
    });
    this.add.sprite(9*width,this.cameras.main.height-height*2,"nextLevel").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.moveLevel(1)
    });
    this.add.sprite(10*width,this.cameras.main.height-height*2,"startRow").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.promptStartRow()
    });
    this.demoButton=this.add.sprite(0*width,this.cameras.main.height-height*3,"demo").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',(e)=>{
      this.toggleDemo()
    }).setTint(this.levelData[this.levelIndex].demo?0x00ff00:0xffffff);
    this.add.sprite(1*width,this.cameras.main.height-height*3,"events").setDisplaySize(width,height).setOrigin(0,0).setScrollFactor(0).setInteractive().on('pointerdown',()=>{
      this.toggleEventsWindow()
    });
    this.marker=this.add.rectangle(0,this.cameras.main.height-height,width,height).setOrigin(0,0).setStrokeStyle(2, 0xff0000).setScrollFactor(0);
  }
  
  toggleEventsWindow() {
    try{
      if (document.querySelector("#eventsWindow")) {
        document.querySelector("#eventsWindow").remove()
        return false;
      }
      
    const div = document.createElement("div")
    div.setAttribute("id","eventsWindow");
    
    const eventsSelect = ()=>{
      let str='';
      this.levelData[this.levelIndex].events.forEach((e,i)=>str+=`<option value="${i}">${GameEvents.descriptions[e.index]}</option>`)
      str+="</select>"
      return str;
    }
    
    const descriptionsSelect = ()=>{
      let str='<select id="descriptionsSelect">';
      GameEvents.descriptions.forEach((desc,i)=>str+=`<option value="${i}">${desc}</option>`)
      str+="</select>"
      return str;
    }
    
    
    
    const populateEvent=()=>{
      
      const index=document.querySelector("#savedEvents").value;
      if (index!==""){
        let html=`
        Start column:<input type="text" id="startColumn" value=${this.levelData[this.levelIndex].events[index].startColumn}>
        `
        
        GameEvents.parameters[this.levelData[this.levelIndex].events[index].index].forEach((param,i)=>{
          console.log(this.levelData[this.levelIndex].events[index].parameters[i])
          try{
          html+=`${param}:<input type="text" id="param_${i}" class="paramInput" value="${this.levelData[this.levelIndex].events[index].parameters[i]}"><br>`
          } catch (er) {alert(er)}
        })
        
        document.querySelector("#paramContainer").innerHTML=html
        
      } else {
        console.log("no value")
      }
    }
    
    const updateSavedEvents=()=> {
      document.querySelector("#savedEvents").innerHTML=eventsSelect()
      populateEvent()
    }
    
    div.innerHTML=`
      <div style="font-size:24px">EVENTS</div>
      SAVED EVENTS:<br>
      <select id="savedEvents">
      ${ eventsSelect() }</select>
      <br>
      EVENT TYPE:<br>
      ${descriptionsSelect()}</select>
      <br>
      PARAMETERS:
      <div id="paramContainer">
      
      </div>
      <div id="newEventBtn" style="position:fixed;bottom:20px;right:20px">NEW</div>
      <div id="applyBtn" style="position:fixed; bottom:20px; left:50%; transform: translateX(-50%);">APPLY</div>
      <div id="closeEventsBtn" style="position:fixed;bottom:20px;left:20px">CLOSE</div>
    `
    
    
    const canvasRect=this.game.canvas.getBoundingClientRect()
    div.onpointerdown = (event) => {
      try {
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.preventDefault()
  } catch (er) {alert(er)}
};
    div.ontouchstart = (event) => {
  event.stopPropagation();
  //event.stopImmediatePropagation();
  //event.preventDefault()
};
    div.onclick = (event) => {
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.preventDefault()
};
    div.style.zIndex=1000
    div.style.height="350px"
    div.style.width="300px"
    div.style.textAlign="center"
    div.style.backgroundColor="#555555";
    div.style.color="#ffffff"
    div.style.fontFamily="Courier"
    
    div.style.position="absolute";
    div.style.top= canvasRect.top+canvasRect.height/2+"px";
    div.style.left=canvasRect.left+canvasRect.width/2+"px";
    div.style.padding="20px"
    //div.style.border="solid 2px black"
    div.style.transform=`translate(-50%,-50%)`;
    
    document.body.appendChild(div)
    document.querySelector("#newEventBtn").onclick=()=>{
      this.levelData[this.levelIndex].events.push({index:0,parameters:[5,""],startColumn:0});
      updateSavedEvents()
      
    }
    
    document.querySelector("#applyBtn").onclick=()=>{
      if (document.querySelector("#savedEvents").value==="") {
        return false;
        
      }
      const event = this.levelData[this.levelIndex].events[document.querySelector("#savedEvents").value];
      try {
      event.index=Number(document.querySelector("#descriptionsSelect").value)
      event.startColumn=Number(document.querySelector("#startColumn").value)
      
      document.querySelectorAll(".paramInput").forEach((param,i)=>{
        console.log(param.value)
        event.parameters[i]=param.value
      })
      
      updateSavedEvents()
      } catch (er) {alert(er)}
    }
    
    document.querySelector("#closeEventsBtn").onclick=()=>{
      this.toggleEventsWindow()
    }
    document.querySelector("#savedEvents").onchange=()=>{
      document.querySelector("#descriptionsSelect").value=this.levelData[this.levelIndex].events[document.querySelector("#savedEvents").value].index
      populateEvent()
    }
    document.querySelector("#descriptionsSelect").onchange=()=>{
      populateEvent()
    }
    populateEvent()
    } catch (er) {alert(er)}
  }
  
  toggleDemo(){
    this.levelData[this.levelIndex].demo=!this.levelData[this.levelIndex].demo;
    
    this.demoButton.setTint(this.levelData[this.levelIndex].demo?0x00ff00:0xffffff);
  }
  
  removeLevel() {
    if (this.levelData.length>1) {
      this.levelData.splice(this.levelIndex,1);
      const delta= this.levelIndex>=this.levelData.length ? -1 :0;
      this.switchLevel(delta,false)
    }
    
  }
  
  promptStartRow() {
    const newStart=prompt("Set starting row:",this.levelData[this.levelIndex].startRow);
    if (!isNaN(newStart)&&newStart>0 && newStart<=this.cells[0].length-1 ) {
      this.levelData[this.levelIndex].startRow=Number(newStart)
    } 
  }
  
  moveLevel(dir) {
    if (this.levelIndex+dir<0||this.levelIndex+dir>=this.levelData.length) {
      return false;
    }
    [this.levelData[this.levelIndex],this.levelData[this.levelIndex+dir]] = [this.levelData[this.levelIndex+dir],this.levelData[this.levelIndex]]
    this.switchLevel(dir,false)
  }
  
  addLevel() {
    if (this.levelIndex===this.levelData.length-1) {
      this.levelData.push(this.getEmptyLevel())
    } else {
      this.levelData.splice(this.levelIndex+1,0,this.getEmptyLevel())
    }
    this.switchLevel(1)
  }
  
  selectTool(i) {
    this.deselectCell()
    this.selectedTool=i;
    this.marker.x=i*this.toolWidth
  }
  
  clearItemWindow(){
    this.itemWindowObjects.forEach(obj=>obj.destroy())
    this.itemWindowObjects=[]
  }
  
  setupItemWindow() {
    
    const bg=this.add.rectangle(this.cameras.main.centerX,this.cameras.main.centerY,700,500,0x555555)
    const top=bg.getTopLeft().y
    const left=bg.getTopLeft().x
    const title=this.add.text(bg.x,top+30,"ITEMS",{fontSize:48}).setOrigin(0.5,0.5)
    
    this.itemWindowObjects=[bg,title];
    
    const spriteSize=80
    const spriteData=ItemManager.getSpriteData()
    const deltaY=80;
    const btnFontSize=64
    
    spriteData.forEach((item,i)=>{
      const x=left+(bg.width/spriteData.length)*(i+0.5)
      
      const sprite=this.add.sprite(x,top+100,item.key,item.frame).setDisplaySize(spriteSize,spriteSize);
      if (item.tint) {
        sprite.setTint(item.tint)
      }
      
      const numLabel = this.add.text(x,sprite.y+deltaY,this.levelItems[i]===-2?"X":this.levelItems[i]===-1?"∞":this.levelItems[i],{fontSize:48}).setOrigin(0.5,0.5);
      
      const incBtn = this.add.text(x,sprite.y+deltaY*2,"+",{fontSize:btnFontSize}).setOrigin(0.5,0.5).setInteractive().on("pointerdown",()=>{
        this.levelItems[i]++;
        numLabel.text=this.levelItems[i]===-1?"∞":this.levelItems[i];
      });
      const decBtn = this.add.text(x,sprite.y+deltaY*3,"-",{fontSize:btnFontSize}).setOrigin(0.5,0.5).setInteractive().on("pointerdown",()=>{
        this.levelItems[i]=Math.max(-2,this.levelItems[i]-1);
        numLabel.text=this.levelItems[i]===-2?"X":this.levelItems[i]===-1?"∞":this.levelItems[i];
      });
      this.itemWindowObjects=[...this.itemWindowObjects,sprite,numLabel,incBtn,decBtn];
    })
    
    const closeBtn=this.add.text(bg.x,top+bg.height-80,"CLOSE",{fontSize:48}).setOrigin(0.5,0.5).setInteractive().on("pointerdown",()=>{
        this.itemWindowObjects.forEach(obj=>{
          obj.visible=false;
        })
      });
    this.itemWindowObjects.push(closeBtn)
    this.itemWindowObjects.forEach(obj=>{
      obj.setScrollFactor(0,0).setVisible(false).setDepth(1000)
    })
  }
  
  hitCell(x,y,cell) {
    //console.log(this.selectedTool)
    if (this.itemWindowObjects[0].visible) {
      return false;
    }
    //console.log(cell.sprite.input)
    if (this.selectedTool<5) {
      if (this.selectedTool<1) {
        cell.sprite.setTexture("__DEFAULT")
        cell.tile=0;
        cell.passable=true;
        //console.log
        cell.sprite.input.hitArea.setSize(32,33)
      } else if (this.selectedTool<5) {
        cell.passable=false;
        cell.sprite.setTexture("blocks")
        cell.sprite.setFrame(this.selectedTool-1)
        cell.sprite.input.hitArea.setSize(this.sourceTileWidth,this.sourceTileHeight)
        cell.tile=this.selectedTool
      }
      cell.sprite.setDisplaySize(this.tileWidth,this.tileHeight)
      this.selectCell(x,y,cell)
    } else if (this.selectedTool==5) {
      this.selectCell(x,y,cell);
    }
    
  }
  
  selectCell(x,y,cell) {
    this.deselectCell();
    this.tileMarker.setPosition(cell.sprite.x,cell.sprite.y)
    this.cellLabel.text=`X: ${x} Y: ${y} Tile: ${cell.tile} Passable: ${cell.passable}`
    this.selectedCell={x:x,y:y};
  }
  
  deselectCell() {
    if (this.selectedCell) {
      this.tileMarker.setPosition(-50,-50)
      this.selectedCell=false;
    }
  }
  
  getEmptyLevel() {
    const data = {title:"Lvl1",tiles:[],items:[-1,-1,-1],startRow:20,events:[]}

    const rows=24;
    const cols=100;
    
    for (let col = 0;col<cols;col++) {
      const colData=[]
      for (let row=0;row<rows;row++) {
        const tile= row==rows-2?1:row==rows-1?2:0
        colData.push({
          tile:tile,
          passable:true,
          entities:[]
        })
      }
      data.tiles.push(colData);
    }
    
    return data
  }
  
  writeToLevelData() {
    
    this.levelData[this.levelIndex].tiles=[]
    this.levelData[this.levelIndex].items=[...this.levelItems]
    this.cells.forEach((rows,col)=>{
      const column=[]
      rows.forEach((cell,row)=>{
        //console.log(col,row)
        const newCell={
          tile:cell.tile,
          passable:cell.passable,
          entities:cell.entities
        }
        column.push(newCell);
      })
      this.levelData[this.levelIndex].tiles.push(column);
    })
  }
  
  save() {
    try{
    this.writeToLevelData()
    //prompt("copy:",JSON.stringify(this.levelData))
    saveFile(this.levelData)
    } catch (er) {
      alert(er)
    }
    
  }
  
  
  
  
  update(time,delta) {
    
    
    
  }
}