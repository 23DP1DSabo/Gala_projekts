// Themes

function lightMode() {
    document.body.classList.add("light-mode");
  }
  
function darkMode() {
    document.body.classList.remove("light-mode");
  }


// Load on home
window.onload = function() {
    window.location.hash = "#home";
};