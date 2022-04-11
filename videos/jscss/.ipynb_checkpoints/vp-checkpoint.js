// 

var video = document.getElementById("myVideo"); 
var point = 0
var speed = 1
let pausePoints = [0,3,6,10,11,12,13,15,16,17]; // In Seconds

document.getElementById("timestampSpan").innerHTML = "Timestamp | " + video.currentTime.toFixed(2);
document.getElementById("pausepointSpan").innerHTML = "Pausepoint | "+Number(point+ + 1);
document.onkeydown = checkKey;

function nextPoint() {
    if (pausePoints.length > point) {
        video.pause();
        point += 1;
        video.currentTime = pausePoints[point];
        document.getElementById("timestampSpan").innerHTML = "Timestamp | " + video.currentTime.toFixed(2);
        document.getElementById("pausepointSpan").innerHTML = "Pausepoint | "+Number(point+ + 1);
    }
}

function previousPoint() {
    if (point > 0) {
        video.pause();
        point = point - 1;
        video.currentTime = pausePoints[point];
        document.getElementById("timestampSpan").innerHTML = "Timestamp | " + video.currentTime.toFixed(2);
        document.getElementById("pausepointSpan").innerHTML = "Pausepoint | "+Number(point+ + 1);
    }
}

function playToNext() {}

function playToPrevious() {}

function checkKey(e) {

    e = e || window.event;
    if (e.keyCode == '32') { // Space Bar: Play/Pause
        clearInterval(playToPrevious);
        clearInterval(playToNext);
        
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
    else if (e.keyCode == '38') { // Up Arrow: Skip to Next Pause Point
        clearInterval(playToPrevious);
        clearInterval(playToNext);

        nextPoint();
    }
    else if (e.keyCode == '40') { // Down Arrow: Skip to Previous Pause Point
        clearInterval(playToPrevious);
        clearInterval(playToNext);

        previousPoint();
    }
    else if (e.keyCode == '39') { // Right Arrow: Play to Next Pause Point
        clearInterval(playToPrevious);
        clearInterval(playToNext);

        point = point + 1;
        
        playToNext = setInterval(function(){
            if (video.currentTime < pausePoints[point]-speed) {
                video.currentTime = video.currentTime + speed;
                document.getElementById("timestampSpan").innerHTML = "Timestamp | " + video.currentTime.toFixed(2);
            } else {
                document.getElementById("pausepointSpan").innerHTML = "Pausepoint | "+Number(point+ + 1);
            }
        }, 20);
    }
    else if (e.keyCode == '37') { // Left Arrow: Play to Previous Pause Point
        clearInterval(playToPrevious);
        clearInterval(playToNext);

        point = point - 1;
        
        playToPrevious = setInterval(function(){
            if (video.currentTime > pausePoints[point]) {
                video.currentTime = video.currentTime - speed;
                document.getElementById("timestampSpan").innerHTML = "Timestamp | " + video.currentTime.toFixed(2);
                document.getElementById("pausepointSpan").innerHTML = "Pausepoint | "+ Number(point+ + 1);
            }
        }, 20);
    }
    else if (e.keyCode == '13') { // Enter: Fullscreen
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) { // Safari
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE11
            video.msRequestFullscreen();
        }
    }
}