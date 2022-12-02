import MyScene from "./three";
import Firefly from "./Three/layout/Firefly";
import Visualizer from "./Three/layout/visualizer";

const videoElement = document.getElementsByClassName('input_video')[0];
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);
let poseWorld = []

const myScene = new MyScene();
let position = "default";

for(let i = 0; i <200;i++){
    const firefly = new Firefly(myScene.getScene(),myScene.getComposer());
    myScene.addObject(firefly.getMesh());
}

for(let i = 0; i < 33;i++){
    const visualizer = new Visualizer(myScene.getScene(),myScene.getComposer());
    myScene.addObject(visualizer.getMesh());
}


Firefly.iniGui(myScene.gui)



function onResults(results) {
    if (!results.poseLandmarks) {
        grid.updateLandmarks([]);
        return;
    }
    poseWorld = results.poseWorldLandmarks;

    let leftEar = Visualizer.visualizers[7].mesh.position
    let leftHand = Visualizer.visualizers[15].mesh.position
    let rightEar = Visualizer.visualizers[8].mesh.position
    let rightHand = Visualizer.visualizers[16].mesh.position



    if(Visualizer.visualizers.length > 0){
        Visualizer.visualizers.forEach((elt,i) => {
            elt.setPosition(poseWorld[i]);
        })
        if( position !== "center" && rightEar.distanceTo(rightHand) < 0.15){
            console.log("center !!")
            position = "center";
        }
        else if( position !== "default" && leftHand.distanceTo(rightHand) < 0.15){
            Firefly.center = null;
            Firefly.distanceHands = null
            position = "default";
            console.log("liberation")
        }
        else if( position !== "2hands" && leftEar.distanceTo(leftHand) < 0.15){
            Firefly.distanceHands = null
            position = "2hands"
            console.log("2hands !!")
        }


        if(position == "center"){
            Firefly.center = Visualizer.calcHalf(leftHand, rightHand);
            Firefly.distanceHands = leftHand.distanceTo(rightHand)
        }
        else if(position == "2hands"){
            Firefly.center = rightHand;

        }

    }
    if(myScene && Firefly.firelfies.length > 0){
        Firefly.firelfies.forEach(firefly => {
            firefly.update();
        })
    }
    if(myScene){
        myScene.update();

    }

    grid.updateLandmarks(results.poseWorldLandmarks);
}




const pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.75,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 1920,
    height: 1080
});
camera.start();



