window.leafmealone = {};


function getImgCvs(){
    if(!leafmealone.cvs) {
        leafmealone.cvs = document.getElementById("imgCanvas");
    }
    return leafmealone.cvs;
}

function getMaskCvs(){
    if(!leafmealone.mskCvs) {
        leafmealone.mskCvs = document.getElementById("maskCanvas");
    }
    return leafmealone.mskCvs;
}

function getMaskCtx(){
    if(!leafmealone.maskCtx) {
        leafmealone.maskCtx = getMaskCvs().getContext("2d");
    }
    return leafmealone.maskCtx;
}

function getCtx(){
    if(!leafmealone.ctx) {
        leafmealone.ctx = getImgCvs().getContext("2d");
    }
    return leafmealone.ctx;
}