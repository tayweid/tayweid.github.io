function onIframeLoad() {
    // Get the document object of the iframe
    var doc = document.getElementById('iframe').contentDocument;

    // Get a list of all elements in the iframe
    var allElements = doc.getElementsByTagName('*');

    for (var i = 0; i < divElements.length; i++) {
      console.log(divElements[i]);
    }
}


// Select an element from the iframe
document.getElementById('Part_A').innerHTML = "test";