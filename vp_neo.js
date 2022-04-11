var video = document.getElementById("the_video"); 
var point = 0
let pause_points = [0,5,10,18,22,40]; // Seconds

document.onkeydown = check_key;

function next_point() {
    video.pause();
    video.currentTime = pause_points[point];
}

function previous_point() {
    video.pause();
    video.currentTime = pause_points[point];
}

function play_to_next() {
    if (video.currentTime >= pause_points[point]) {
        video.pause();
    }
}

function loop_from_previous() {
    if (video.currentTime >= pause_points[point]) {
        video.currentTime = pause_points[point-1];
        video.play();
    }
}

// 

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
        if (point < pause_points.length-1) {
            point = point + 1;
        }
        next_point();
        video.removeEventListener("timeupdate", loop_from_previous);
        video.removeEventListener("timeupdate", play_to_next);
    }
    else if (e.keyCode == '40') { // Down Arrow: Skip to Previous Pause Point
        if (point > 0) {
            point = point - 1;
        }
        previous_point();
        video.removeEventListener("timeupdate", loop_from_previous);
        video.removeEventListener("timeupdate", play_to_next);
    }
    else if (e.keyCode == '39') { // Right Arrow: Play to Next Pause Point
        if (point < pause_points.length) {
            point = point + 1;
        }
        video.play();
        video.addEventListener("timeupdate", play_to_next);
        video.removeEventListener("timeupdate", loop_from_previous);
    }
    else if (e.keyCode == '37') { // Left Arrow: Play to Previous Pause Point
        video.play();
        video.addEventListener("timeupdate", loop_from_previous);
        video.removeEventListener("timeupdate", play_to_next);
    }
    else if (e.keyCode == '13') { // Enter: Fullscreen
        if (video.requestFullscreen) {
            video.requestFullscreen();
            console.log(e.keyCode);
        } else if (video.webkitRequestFullscreen) { // Safari
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE11
            video.msRequestFullscreen();
        }
    }
    else if (e.key == 'f') { // Enter: Fullscreen
        if (video.requestFullscreen) {
            video.requestFullscreen();
            console.log(e.keyCode);
        } else if (video.webkitRequestFullscreen) { // Safari
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { // IE11
            video.msRequestFullscreen();
        }
    }
}
