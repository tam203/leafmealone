define(['dojo/_base/lang',
    'dojo/_base/declare'], function (lang, declare) {

    //noinspection JSUnusedGlobalSymbols
    return declare([],{
        isDrawing: false,

        constructor:function(canvas, maskCanvas){
            this._ctx = canvas.getContext("2d");
            this._cvs = canvas;
            this._mCtx = maskCanvas.getContext("2d");
            this._mCvs = maskCanvas;
            this._mCvs.style.opacity = 0.6;
            this._addListeners();
        },

        _addListeners:function(){
            // touch
            this._mCvs.addEventListener('touchstart',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('touchmove',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('touchend',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('touchleave',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('touchcancel',lang.hitch(this, this.draw), false);
            // mouse
            this._mCvs.addEventListener('mousedown',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('mousemove',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('mouseout',lang.hitch(this, this.draw), false);
            this._mCvs.addEventListener('mouseup',lang.hitch(this, this.draw), false);
        },

        _doPoint:function(coors){
            this._mCtx.lineWidth=1;
            this._mCtx.beginPath();
            this._mCtx.arc(coors.x, coors.y,this._getSize(),0,2*Math.PI,false);
            this._mCtx.fill();
            this._mCtx.lineWidth=this._getSize() * 2;
        },
        touchstart: function(coors){
            this._doPoint(coors);
            this._mCtx.beginPath();
            this._mCtx.moveTo(coors.x, coors.y);
            this.isDrawing = true;
        },
        touchmove: function(coors){
            if (this.isDrawing) {
                this._mCtx.lineTo(coors.x, coors.y);
                this._mCtx.stroke();
                this._doPoint(coors);
                this._mCtx.beginPath();
                this._mCtx.moveTo(coors.x, coors.y);
            }
        },
        touchend: function(){
            this.isDrawing = false;
        },
        touchleave: function(){this.touchend();},
        mousedown:function(coors){this.touchstart(coors);},
        mouseout:function(){this.touchend();},
        mousemove:function(coors){this.touchmove(coors);},
        mouseup:function(){this.touchend();},
        touchcancel:function(coors){this.touchend(coors);},

        draw:function(event){
            if(!(event.targetTouches && event.targetTouches.length > 1)){
                event.preventDefault();
                // get the touch coordinates
                var coors;
                try{
                    coors = (event.targetTouches) ?  this._getTouchCoords(event) : this._getMouseCoords(event);
                } catch (e) {
                    coors = {x:0, y:0}
                }
                //console.log(coors.x, coors.y);
                // pass the coordinates to the appropriate handler
                this[event.type](coors);
            }
        },

        _getMouseCoords:function(event){
            var s = window.getComputedStyle(event.target, null);
            var realW = parseInt(s['width'].replace('px', ''));
            var ratio = event.target.width / realW;
            return {
                x: event.offsetX * ratio,// - event.target.offsetParent.offsetLeft,
                y: event.offsetY * ratio //- event.target.offsetParent.offsetTop
            };
        },

        _getTouchCoords:function(event){
            event = event.targetTouches[0];
            var s = window.getComputedStyle(event.target, null);
            var realW = parseInt(s['width'].replace('px', ''));
            var ratio = event.target.width / realW;
            return {
                x: (event.pageX - event.target.offsetParent.offsetLeft) * ratio,
                y: (event.pageY - event.target.offsetParent.offsetTop) * ratio
            };
        },

        addImageToCvs: function(dataUrl){
            // load image from data url
            var imageObj = new Image();
            imageObj.onload = lang.hitch(this, (function(e){this._imgOnCvs(e.target)}));
            imageObj.src = dataUrl;
        },

        _imgOnCvs: function(img) {
            var ratio = this._cvs.width/ img.width;
            var width =  ratio * img.width;
            var height = ratio * img.height;


            // Resize the canvas to fit the image
            this._cvs.height = height;
            this._mCvs.height = height ;

            this._ctx.drawImage(img, 0, 0, width, height);

        },

        maskImage:function(){
            var maskData = this._mCtx.getImageData(0,0,this._mCvs.width,this._mCvs.height);
            var mask = maskData.data;

            var imgData = this._ctx.getImageData(0,0,this._cvs.width,this._cvs.height);

            for(var i=0; i<mask.length; i+=4) {
                imgData.data[i+3] = Math.abs(mask[i+3] - 1);
            }

            this._ctx.putImageData(imgData, 0, 0);
            this._mCtx.clearRect(0,0,this._mCvs.width,this._mCvs.height)
        },

        toUrl:function(){
            return this._cvs.toDataURL();
        },

        _getSize:function(){
            var size = parseInt(document.getElementById("size").value);
            return (!isNaN(size)?  size : 20);
        }
    });
});

