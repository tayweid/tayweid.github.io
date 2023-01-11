// Start Video

var Video = document.getElementById("The_Video"); 
var Timekeeper = document.getElementById("Timekeeper");
var Description = document.getElementById("Description");
var Point = 0;
var Target = 0;


// Timer and Description

setInterval(Set_Timekeeper, 100);

function Set_Timekeeper() {
    Timekeeper.innerHTML = Video.currentTime.toFixed(1);
    Description.innerHTML = Descriptions[Point];
}


// Time Controls

function Point_Forward() {
    if (Point < Pause_Points.length-1) {
        Point = Point + 1;
    }
    Target = Pause_Points[Point];
}

function Point_Backward() {
    if (Point > 0) {
        Point = Point - 1;
    }
    Target = Pause_Points[Point];
}

function Skip_Forward() {
    Point_Forward();
    Video.currentTime = Target;
}

function Skip_Backward() {
    Point_Backward();
    Video.currentTime = Target;
}

function Play_To() {
    if (Video.currentTime < Target - 0.1) {
        setTimeout(Video.currentTime = Video.currentTime + 0.1, 0.1);
    }
    if (Video.currentTime > Target) {
        setTimeout(Video.currentTime = Video.currentTime - 0.1, 0.1);
    }
}


// I need to do another thing, updating the point as I move through the video. If I go past the next point, the point automatically updates

// Check whether Target > Pause_Point[Point-1]

function Update_Point() {
    if (Target > Pause_Point[Point-1]) {
        Point = Point + 1
    }
}
//setInterval(Update_Point(),100);
//this doesn't work yet

// The next update will also include a looping function, which will essentially just update the target to the past pause point when it equals or exceeds the current pause point.


// Check Keys

document.onkeydown = Check_Key;

var Play = setInterval(Play_To, 100);

function Check_Key(e) {
    
    e = e || window.event;
    console.log(e.keyCode);
        
    // f: Fullscreen
    
    if (e.key == 'f') {
        Video.webkitEnterFullscreen();
        Video.enterFullscreen();
    }
    
    // Up Arrow: Skip to Next Pause Point
    
    if (e.keyCode == '38') { 
        Skip_Forward();
    }
    
    // Down Arrow: Skip to Previous Pause Point
    
    if (e.keyCode == '40') {
        Skip_Backward();
    }
    
    // Right Arrow: Play to Next Pause Point
    
    if (e.keyCode == '39') {
        Point_Forward();
    }
    
    // Left Arrow: Play to Previous Pause Point
    
    if (e.keyCode == '37') {
        Point_Backward();
    }
    
    // s: Increment Forward
    
    if (e.keyCode == '83') {
        Target = Target + 0.1
        //Video.currentTime = Video.currentTime + 0.1
    }
    
    // a: Increment Backward
    
    if (e.keyCode == '65') {
        Target = Target - 0.1
        //Video.currentTime = Video.currentTime - 0.1
    }
    
}

