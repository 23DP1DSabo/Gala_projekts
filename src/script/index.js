// Themes

function lightMode() {
    document.body.classList.toggle("light-mode");
  }
  
function darkMode() {
    document.body.classList.toggle("dark-mode");
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