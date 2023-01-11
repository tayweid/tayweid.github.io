function search() {
  // get the search query from the search input field
  var query = document.getElementById("search-input").value;

  // search through the main content and sidebars for the query
  var mainContent = document.getElementById("main-content");
  var leftSidebar = document.getElementById("left-sidebar");
  var rightSidebar = document.getElementById("right-sidebar");
  var content = mainContent.innerHTML + leftSidebar.innerHTML + rightSidebar.innerHTML;

  // use regular expressions to find the query in the content
  var regex = new RegExp(query, "gi");
  var results = content.match(regex);

  // if there are no results, display a message
  if (results == null) {
    alert("No results found.");
  } else {
    // if there are results, highlight the matches
    var newContent = content.replace(regex, "<mark>" + query + "</mark>");
    mainContent.innerHTML = newContent;
    leftSidebar.innerHTML = newContent;
    rightSidebar.innerHTML = newContent;
  }
}
