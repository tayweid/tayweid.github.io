
/* This function turns on the active element in the sidebar and displays the active section. */

function switch_page(name) {
    
    window.location.hash = name
    
    var name = window.location.hash;
    
    if (name=='') {
        document.getElementsByClassName("home_head")[0].classList.add("active");
        document.getElementsByClassName("research_head")[0].classList.remove("active");
        document.getElementsByClassName("teaching_head")[0].classList.remove("active");
        document.getElementsByClassName("cv_head")[0].classList.remove("active");
        document.getElementsByClassName("else_head")[0].classList.remove("active");
        
        document.getElementById("home_section").style.display = "block";
        document.getElementById("research_section").style.display = "none";
        document.getElementById("teaching_section").style.display = "none";
        document.getElementById("cv_section").style.display = "none";
        document.getElementById("else_section").style.display = "none";
    }
    if (name=='#home') {
        document.getElementsByClassName("home_head")[0].classList.add("active");
        document.getElementsByClassName("research_head")[0].classList.remove("active");
        document.getElementsByClassName("teaching_head")[0].classList.remove("active");
        document.getElementsByClassName("cv_head")[0].classList.remove("active");
        document.getElementsByClassName("else_head")[0].classList.remove("active");
        
        document.getElementById("home_section").style.display = "block";
        document.getElementById("research_section").style.display = "none";
        document.getElementById("teaching_section").style.display = "none";
        document.getElementById("cv_section").style.display = "none";
        document.getElementById("else_section").style.display = "none";
    } 
    if (name=='#research') {
        document.getElementsByClassName("home_head")[0].classList.remove("active");
        document.getElementsByClassName("research_head")[0].classList.add("active");
        document.getElementsByClassName("teaching_head")[0].classList.remove("active");
        document.getElementsByClassName("cv_head")[0].classList.remove("active");
        document.getElementsByClassName("else_head")[0].classList.remove("active");
        
        document.getElementById("home_section").style.display = "none";
        document.getElementById("research_section").style.display = "block";
        document.getElementById("teaching_section").style.display = "none";
        document.getElementById("cv_section").style.display = "none";
        document.getElementById("else_section").style.display = "none";
    } 
    if (name=="#teaching") {
        document.getElementsByClassName("home_head")[0].classList.remove("active");
        document.getElementsByClassName("research_head")[0].classList.remove("active");
        document.getElementsByClassName("teaching_head")[0].classList.add("active");
        document.getElementsByClassName("cv_head")[0].classList.remove("active");
        document.getElementsByClassName("else_head")[0].classList.remove("active");
        
        document.getElementById("home_section").style.display = "none";
        document.getElementById("research_section").style.display = "none";
        document.getElementById("teaching_section").style.display = "block";
        document.getElementById("cv_section").style.display = "none";
        document.getElementById("else_section").style.display = "none";
    }
    if (name=="#cv") {
        document.getElementsByClassName("home_head")[0].classList.remove("active");
        document.getElementsByClassName("research_head")[0].classList.remove("active");
        document.getElementsByClassName("teaching_head")[0].classList.remove("active");
        document.getElementsByClassName("cv_head")[0].classList.add("active");
        document.getElementsByClassName("else_head")[0].classList.remove("active");
        
        document.getElementById("home_section").style.display = "none";
        document.getElementById("research_section").style.display = "none";
        document.getElementById("teaching_section").style.display = "none";
        document.getElementById("cv_section").style.display = "block";
        document.getElementById("else_section").style.display = "none";
    }
    if (name=="#else") {
        document.getElementsByClassName("home_head")[0].classList.remove("active");
        document.getElementsByClassName("research_head")[0].classList.remove("active");
        document.getElementsByClassName("teaching_head")[0].classList.remove("active");
        document.getElementsByClassName("cv_head")[0].classList.remove("active");
        document.getElementsByClassName("else_head")[0].classList.add("active");
        
        document.getElementById("home_section").style.display = "none";
        document.getElementById("research_section").style.display = "none";
        document.getElementById("teaching_section").style.display = "none";
        document.getElementById("cv_section").style.display = "none";
        document.getElementById("else_section").style.display = "block";
    }
    
}

