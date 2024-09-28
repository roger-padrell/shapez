class Canvas{
    constructor(target){
        this.target = target;
        this.ctx = target.getContext("2d")
        this.moves = [];
    }
    drawPointAt(x,y){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(x,y,1,1);
    }
    clear(){
        this.ctx.clearRect(0, 0, this.target.width, this.target.height);
    }
    render(){
        this.clear();
        for(let m in this.moves){
            let arr = this.moves[m].split(" ");
            if(arr[0]=="rect"){
                arr.shift();
                this.ctx.fillRect(...arr)
                console.log("rect")
            }
        }
    }
}