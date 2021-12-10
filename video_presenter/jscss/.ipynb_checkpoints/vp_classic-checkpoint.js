// 

var video = document.getElementById("the_video"); 
var point = 0
let pause_points = [0,3,6,10,11,12,13,15,16,17]; // Seconds

document.onkeydown = check_key;

function next_point() {
    if (pause_points.length > point) {
        video.pause();
        video.currentTime = pause_points[point];
    }
}

function previous_point() {
    if (point > 0) {
        video.pause();
        video.currentTime = pause_points[point];
    }
}

function play_to_next() {
    if (video.currentTime >= pause_points[point+1]) {
        video.pause();
    }
}

function play_to_previous() {
    var reverse = setInterval(
        function() {
            if (video.currentTime > pause_points[point-1]) {
                video.currentTime = video.currentTime - 0.1;
            } else {
            point = point - 1;
            video.pause();
            clearInterval(reverse);
            }
    },
    50);
}




// clearInterval(reverse);

function check_key(e) {

    e = e || window.event;
    if (e.keyCode == '32') { // Space Bar: Play/Pause
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }
    else if (e.keyCode == '38') { // Up Arrow: Skip to Next Pause Point
        point = point + 1;
        next_point();
    }
    else if (e.keyCode == '40') { // Down Arrow: Skip to Previous Pause Point
        point = point - 1;
        previous_point();
    }
    else if (e.keyCode == '39') { // Right Arrow: Play to Next Pause Point
        point = point + 1;
        video.play();
        video.addEventListener("timeupdate", play_to_next);
    }
    //else if (e.keyCode == '37') { // Left Arrow: Play to Previous Pause Point
    //    video.pause();
    //}
    // button to loop between two points
    // this button re-runs from the last point and continues on a loop
    
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
