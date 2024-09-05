// Start Video

var Video = document.getElementById("The_Video"); 
var Timekeeper = document.getElementById("Timekeeper");
var Content = document.getElementById("Content")
var Description = document.getElementById("Description");
var Point = 0;
var Target = 0;


// Timer

setInterval(Set_Timekeeper, 100);

function Set_Timekeeper() {
    Timekeeper.innerHTML = Video.currentTime.toFixed(1);
}

// Time Controls

function Smallest_Number_Greater_Than(array, x) {
    const filtered = array.filter(number => number > x);
    if (filtered.length === 0) {
        return Video.currentTime;
    }
    return Math.min(...filtered);
}

function Largest_Number_Less_Than(array, x) {
    const filtered = array.filter(number => number < x);
    if (filtered.length === 0) {
        return Video.currentTime;
    }
    return Math.max(...filtered);
}

function Get_Next_Point() {
    return Smallest_Number_Greater_Than(Pause_Points, Target);
}

function Get_Previous_Point() {
    return Largest_Number_Less_Than(Pause_Points, Target);
}

function Skip_To_Next_Point() {
    Target = Smallest_Number_Greater_Than(Pause_Points, Target);
    Video.currentTime = Target;
}

function Skip_To_Previous_Point() {
    Target = Largest_Number_Less_Than(Pause_Points, Target);
    Video.currentTime = Target;
}

function Play_To() {
    if (Video.currentTime < Target) {
        setTimeout(Video.currentTime = Video.currentTime + 0.1, 0.1);
    }
    if (Video.currentTime > Target) {
        setTimeout(Video.currentTime = Video.currentTime - 0.1, 0.1);
    }
}

// Other Functions

function Toggle_Fullscreen(videoElement) {
    if (!document.fullscreenElement) {
        videoElement.requestFullscreen().catch(err => {
            console.error("Failed to enter fullscreen mode:", err);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.error("Failed to exit fullscreen mode:", err);
        });
    }
}

// Check Keys

document.onkeydown = Check_Key;

var Play = setInterval(Play_To, 100);

function Check_Key(e) {
    
    e = e || window.event;
    console.log(e.keyCode);
    
    // f: Fullscreen
    
    if (e.key == 'f') {
        Toggle_Fullscreen(Video); // Call this function to toggle fullscreen mode
    }
    
    // Up Arrow: Skip to Next Pause Point
    
    if (e.keyCode == '38') { 
        Skip_To_Next_Point();
        e.preventDefault();
    }
    
    // Down Arrow: Skip to Previous Pause Point
    
    if (e.keyCode == '40') {
        Skip_To_Previous_Point();
        e.preventDefault();
    }
    
    // Right Arrow: Play to Next Pause Point
    
    if (e.keyCode == '39') {
        Target = Get_Next_Point();
        Play_To();
        e.preventDefault();
    }
    
    // Left Arrow: Play to Previous Pause Point
    
    if (e.keyCode == '37') {
        Target = Get_Previous_Point();
        Play_To();
        e.preventDefault();
    }
    
    // s: Increment Forward
    
    if (e.keyCode == '83') {
        Target = Target + 0.1;
        Video.currentTime = Target;
    }
    
    // a: Increment Backward
    
    if (e.keyCode == '65') {
        Target = Target - 0.1;
        Video.currentTime = Target;
    }

    // spacebar: Add/Remove Pause_Point

    if (e.keyCode === 32) {
        Toggle_Pause_Point(Target);
    }

    // e: Export Pause Points

    if (e.keyCode == '69') {
        Export_Pause_Points()
    }

    // Test Key

    //if (e.keyCode == '84') {
    //    //Target = Get_Next_Point();
    //    Target = Get_Previous_Point();
    //    Play_To();
    //}
}


// Update and Export Pause_Points

function Toggle_Pause_Point(number) {
    // Check if the number is already in the list
    const index = Pause_Points.indexOf(number);

    if (index === -1) {
        // Number is not in the list, add it
        Pause_Points.push(number);
    } else {
        // Number is already in the list, remove it
        Pause_Points.splice(index, 1);
    }

    // Sort the list in ascending order
    Pause_Points.sort((a, b) => a - b);

    console.log('Current List:', Pause_Points); // For debugging purposes
}

function Export_Pause_Points() {
    // Convert the Pause_Points array to a string
    const exportContent = `let Pause_Points = ${JSON.stringify(Pause_Points)};`;

    // Create a Blob from the string content
    const blob = new Blob([exportContent], { type: 'text/javascript' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const pageTitle = document.title;
    console.log('Page Title:', document.title);


    link.download = `${pageTitle}.js`;

    // Trigger the download
    link.click();

}

const tolerance = 0.05; // Tolerance in seconds

// Function to update the background color based on pause points
function updateBackgroundColor() {
    const isNearPausePoint = Pause_Points.some(point => 
        Math.abs(Video.currentTime - point) <= tolerance
    );

    if (isNearPausePoint) {
        Content.style.borderColor = 'red';
    } else {
        Content.style.borderColor = ''; // Revert to original background color
    }
}

// Listen for keydown and timeupdate event on the video
Video.addEventListener('timeupdate', updateBackgroundColor);
document.addEventListener('keydown', updateBackgroundColor);
// Run updateBackgroundColor when the page loads
updateBackgroundColor();