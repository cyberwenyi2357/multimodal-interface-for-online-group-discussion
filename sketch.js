let poseNet;
let poses = [];
let previous;
let flag = false;

let video;
let speechRec;
let record = [];
function setup() {
  let cnv = createCanvas(600, 420);
  cnv.position(420, 0);
  video = createCapture(VIDEO);
  video.size(600, 420);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, { multiplier: 0.5 }, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
  speechRec = new p5.SpeechRec("en-US", gotSpeech);
  speechRec.onStart=()=>{console.log('speech recognition has started.');}
  speechRec.onError=()=>{
    console.log("error")
    console.log(speechRec);
  }
  speechRec.onEnd=()=>{console.log('speech rec end');speechRec.start();}

  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;
  // let interimResults = true;
  speechRec.start(continuous, interimResults);
  let output = select("#speech");

  function gotSpeech() {
    // console.log(speechRec.resultValue);
    if (speechRec.resultValue) {
      let said = speechRec.resultString;
      said.fontcolor("white");
      //console.log(said);
      if (flag) {
        record.push('<p style="color:rgba(225,180,67,1)">' + said + "</p>");
        //said = said.fontcolor("rgb(0, 80, 0)");
        flag = false;
      }else{
        record.push("<p>" + said + "</p>");
      }
      //console.log(flag)
      console.log(said);
      output.html(record.join(""));
    }
  }
}

function modelReady() {
  print("Model PoseNet Loaded");
}

function draw() {
  image(video, 0, 0, 600, 420);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    if (frameCount % 90 == 0) {
      previous = poses[i].pose;
    }

    let nose = pose.keypoints[0];
    if (previous != undefined && abs(nose.position.y - previous.keypoints[0].position.y) >= 25) {
      print("Nod");
      flag = true;
      console.log(nose.position.y - previous.keypoints[0].position.y);
    }

    if (nose.score > 0.2) {
      noStroke();
      fill(0, 96, 255);
      //ellipse(nose.position.x+5, nose.position.y+5, 10,10);
      ellipse(nose.position.x, nose.position.y, 10, 10);
    }
  }
}
