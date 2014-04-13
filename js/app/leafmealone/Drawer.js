define(['dojo/_base/lang',
    'dojo/_base/declare'], function (lang, declare) {

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
            this._mCtx.arc(coors.x, coors.y,this._getSize(),0,2*Math.PI);
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
        touchend: function(coors){
            this.isDrawing = false;
        },
        touchleave: function(coors){this.touchend(coors);},
        mousedown:function(coors){this.touchstart(coors);},
        mouseout:function(coors){this.touchend(coors);},
        mousemove:function(coors){this.touchmove(coors);},
        mouseup:function(coors){this.touchend(coors);},
        touchcancel:function(coors){this.touchend(coors);},

        draw:function(event){
            event.preventDefault();
            // get the touch coordinates
            try{
                var target = (event.targetTouches) ?  event.targetTouches[0] : event;
                var s = window.getComputedStyle(target.target, null);
                var realW = parseInt(s['width'].replace('px', ''));
                var ratio = target.target.width / realW;
                var coors = {
                    x: target.offsetX * ratio,// - event.target.offsetParent.offsetLeft,
                    y: target.offsetY * ratio //- event.target.offsetParent.offsetTop
                };
            } catch (e) {
                coors = {x:0, y:0}
            }
            console.log(coors.x, coors.y);
            // pass the coordinates to the appropriate handler
            this[event.type](coors);
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
            var img = imgData.data;

            for(var i=0; i<mask.length; i+=4) {
                imgData.data[i+3] = Math.abs(mask[i+3] - 1);
            };

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

