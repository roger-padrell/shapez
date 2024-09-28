var canvas = new Canvas(document.getElementById("canvas"));
canvas.target.width=1000;
canvas.target.height=1000/16*9
class Vector2{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.type="v2";
    }
    string(separator){
        return this.x + separator + this.y;
    }
}
function* IDGenerator(){
    let x=0;
    while(true){
        yield x;
        x++;
    }
}
let pointIdGenerator = IDGenerator();

function relativePos(e){
    let x = (e.clientX - e.currentTarget.offsetLeft)/e.currentTarget.clientWidth*canvas.target.width; 
    let y = (e.clientY - e.currentTarget.offsetTop)/e.currentTarget.clientHeight*canvas.target.height; 
    x=Math.abs(x);
    y=Math.abs(y);
    return new Vector2(x,y)
}

class Move{
    constructor(type, params){
        this.type = type;
        this.params = params;
    }
    string(){
        let str = this.type + " ";
        for(let p in this.params){
            str += this.params[p] + " "
        }
        str = str.slice(0,str.length-1);
        return str;
    }
}

let nshapes = []
let shapes = {};
shapes.rect = class{
    constructor(){
        canvas.target.addEventListener("mousedown",this.getStart)
        canvas.target.style.cursor="crosshair"
    }
    create(){
        canvas.moves.push(new Move(
            "rect",
            [
                this.start.string(" "),
                this.end.string(" ")
            ]
        ).string())
        canvas.render()
    }
    getStart(e){
        let s = nshapes[nshapes.length-1];
        s.start = relativePos(e);
        canvas.target.removeEventListener("mousedown",s.getStart);
        canvas.target.addEventListener("mouseup",s.getEnd);
    }
    getEnd(e){
        let s = nshapes[nshapes.length-1];
        s.end = relativePos(e);
        s.end.x -= s.start.x;
        s.end.y -= s.start.y;
        canvas.target.removeEventListener("mouseup",s.getEnd);
        canvas.target.style.cursor="default";
        s.create();
    }
}

function createShape(shapeName){
    nshapes.push(new shapes[shapeName]());
}

class Connection{
    constructor(from, to){
        this.from=from;
        this.to=to;
    }
}

class Point{
    constructor(x,y=""){
        //position
        if(x.type && x.type == "v2"){
            this.pos = x;
        }
        else{
            this.pos = new Vector2(x,y);
        }

        this.type="point";

        //create id
        this.id=String(pointIdGenerator.next().value);

        //instantiate connectors
        this.connnections = {from:[],to:[]};
    }
    connectionFrom(c){
        this.connnections.from.push(c);
    }
    connectionTo(point){
        if(point.type!="point"){
            console.log("Connection to called but argument is not a Point.")
            return 0;
        }
        if(point.id == this.id){
            console.log("Point can't be connected to itself.")
            return 0;
        }

        let c = new Connection(this,point);
        point.connectionFrom(c);
        this.connnections.to.push(c);
    }
}

function createPointAt(v2){
    let p = new Point(v2);
    canvas.moves.push(p);
    canvas.render()
}
canvas.target.oncontextmenu = function(e){
    e.preventDefault();
    createPointAt(relativePos(e))
}