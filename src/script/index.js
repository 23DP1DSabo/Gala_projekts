// Themes

function lightMode() {
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }
  
function darkMode() {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
  }


// Languages

function latvianMode() {
  // TODO
}

function englishMode() {
  // TODO
}

function italianMode() {
  // TODO
}


// Load on home
window.onload = function() {
    window.location.hash = "#home";
};