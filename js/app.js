

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    init();
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function init(){
    document.getElementById('imageUpLoad').addEventListener('change', handleFileSelect, false);
    addDrawListeners(getMaskCvs());
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = (files.length > 0 ) ? files[0] : null;
    if(file){
        updateViewWithFile(file);
    }
}

function updateViewWithFile(file){
    try{
        var reader = new FileReader();
        reader.onload = (function(){return function (e){addImageToCvs(e.target.result, file)}})();
        reader.readAsDataURL(file);
        document.getElementById("output").innerHTML = "File name = " + file.name;
    } catch (e) {
        console.log("error updating view with file: " + file);
    }
}

function showThumb(dataUrl, file){
    newImage(dataUrl, file.name);
}

function newImage(url, alt){
    var img = document.createElement("img");
    img.src = url;
    img.alt = alt;
    img.style.maxWidth = "120px";
    document.getElementById("images").appendChild(img);
}

function send(){
    var dataURL = getImgCvs().toDataURL();
    $.ajax({
        type: "POST",
        url: "process.php",
        data: {
            img: dataURL
        }
    }).done(imageUploaded);
}

function imageUploaded(result){
    window.location = result.url;
}