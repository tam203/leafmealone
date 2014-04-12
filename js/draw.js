/**
 * Created with IntelliJ IDEA.
 * User: theo
 * Date: 12/04/14
 * Time: 19:52
 * To change this template use File | Settings | File Templates.
 */


// create a drawer which tracks touch movements
var drawer = {
    isDrawing: false,
    touchstart: function(coors){
        getMaskCtx().lineWidth=15;
        getMaskCtx().beginPath();
        getMaskCtx().moveTo(coors.x, coors.y);
        this.isDrawing = true;
    },
    touchmove: function(coors){
        if (this.isDrawing) {
            getMaskCtx().lineTo(coors.x, coors.y);
            getMaskCtx().stroke();
        }
    },
    touchend: function(coors){
        //if (this.isDrawing) {
            //this.touchmove(coors);
            this.isDrawing = false;
        //}
    },

    touchleave: function(coors){
        this.touchend(coors);
    },

    mousedown:function(coors){
        this.touchstart(coors);
    },

    mouseout:function(coors){
        this.touchend(coors);
    },

    mousemove:function(coors){
        this.touchmove(coors);
    },

    mouseup:function(coors){
        this.touchend(coors);
    },

    touchcancel:function(coors){
        this.touchend(coors);
    }
};

function addDrawListeners(canvas){
    // attach the touch event listeners.
    canvas.addEventListener('touchstart',draw, false);
    canvas.addEventListener('touchmove',draw, false);
    canvas.addEventListener('touchend',draw, false);
    canvas.addEventListener('touchleave',draw, false);
    canvas.addEventListener('touchcancel',draw, false);

    // attach the mouse events listeners.
    canvas.addEventListener('mousedown',draw, false);
    canvas.addEventListener('mousemove',draw, false);
    canvas.addEventListener('mouseout',draw, false);
    canvas.addEventListener('mouseup',draw, false);
}

// create a function to pass touch events and coordinates to drawer
function draw(event){

    console.log(event.type);
    event.preventDefault();
    // get the touch coordinates
    try{
        var target = (event.targetTouches) ?  event.targetTouches[0] : event;
        var coors = {
//            x: (event.targetTouches)? event.targetTouches[0].pageX : event.clientX - event.target.offsetParent.offsetLeft,
//            y: (event.targetTouches)? event.targetTouches[0].pageY :  event.clientY - event.target.offsetParent.offsetTop
            x: target.clientX - event.target.offsetParent.offsetLeft,
            y: target.clientY - event.target.offsetParent.offsetTop
        };
    } catch (e) {
        coors = {x:0, y:0}
    }
    // pass the coordinates to the appropriate handler
    drawer[event.type](coors);
}

function addImageToCvs(dataUrl){
    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
        var ratio = 200/ this.width;
        var height = ratio * this.height;
        getCtx().drawImage(this, 0, 0, 200, height);
    };

    imageObj.src = dataUrl;
}

function doMasking(){
    var maskData = getMaskCtx().getImageData(0,0,getMaskCvs().width,getMaskCvs().height);
    var mask = maskData.data;

    var imgData = getCtx().getImageData(0,0,getImgCvs().width,getImgCvs().height);
    var img = imgData.data;

    for(var i=0; i<mask.length; i+=4) {
        imgData.data[i+3] = Math.abs(mask[i+3] - 1);
    };

    getCtx().putImageData(imgData, 0, 0);
    getMaskCtx().clearRect(0,0,getMaskCvs().width,getMaskCvs().height)
}