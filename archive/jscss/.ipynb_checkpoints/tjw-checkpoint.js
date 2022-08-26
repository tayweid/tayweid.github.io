function switchPage(name) {
    document.getElementById("homeButton").classList.remove('homeActive');
    document.getElementById("researchButton").classList.remove("researchActive");
    document.getElementById("teachingButton").classList.remove("teachingActive");
    document.getElementById("cvButton").classList.remove("cvActive");
    document.getElementById("contactButton").classList.remove("contactActive");
    document.getElementById("elseButton").classList.remove("elseActive");
        
    if (name=="home") {
        document.getElementById("homeButton").classList.add('homeActive');
    } 
    if (name=="research") {
        document.getElementById("researchButton").classList.add("researchActive");
    } 
    if (name=="teaching") {
        document.getElementById("teachingButton").classList.add("teachingActive");
    }
    if (name=="cv") {
        document.getElementById("cvButton").classList.add("cvActive");
    }
    if (name=="contact") {
        document.getElementById("contactButton").classList.add("contactActive");
    } 
    if (name=="else") {
        document.getElementById("elseButton").classList.add("elseActive");
    }
}