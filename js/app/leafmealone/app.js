define(
['dojo/request/xhr',
    'dojo/on',
    'leafmealone/Drawer',
    'dojo/_base/lang'],
function(xhr, on, Drawer, lang) {
return {
    run:function(){
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            this._d = new Drawer(
                document.getElementById("imgCanvas"),
                document.getElementById("maskCanvas")
            );
            this._init();
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    },

    _init:function(){
        document.getElementById('imageUpLoad').addEventListener('change', lang.hitch(this, this._handleFileSelect), false);
        on(document.getElementById("doMaskBtn"),"click", lang.hitch(this._d, this._d.maskImage));
        on(document.getElementById("sendBtn"),"click", lang.hitch(this, this._send));
    },

    _handleFileSelect: function(evt) {
        var files = evt.target.files; // FileList object
        var file = (files.length > 0 ) ? files[0] : null;
        if(file){
            this._updateViewWithFile(file);
        }
    },

    _updateViewWithFile: function(file){
        try{
            var reader = new FileReader();
            reader.onload = lang.hitch(this, function(e){this._d.addImageToCvs(e.target.result)});
            reader.readAsDataURL(file);
        } catch (e) {
            console.log("error updating view with file: " + file);
        }
    },

    _send:function(){
        var dataURL = this._d.toUrl();
        xhr.post("process.php",{
            data: {
                img: dataURL
            },
            handleAs:"json"
        }).then(lang.hitch(this, this._imageUploaded));
    },

    _imageUploaded: function(result){
        if(result.url){
            window.location = result.url;
        }
    }
}});
