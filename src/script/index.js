// Themes ------
function lightMode() {
    document.body.classList.toggle("light-mode");
  }
  
function darkMode() {
    document.body.classList.toggle("dark-mode");
  }



// Languages ------
function latvianMode() {
  // TODO
}

function englishMode() {
  // TODO
}

function italianMode() {
  // TODO
}



// Load on home ------
if (!window.location.hash) {
    window.location.hash = "#home";
}



// Header not overflowing onto content ------
const header = document.getElementById('header');
const hero = document.getElementById('home');

const updateHeroPadding = () => {
    if (!header || !hero) return;
    const h = header.offsetHeight;
    hero.style.paddingTop = `${h}px`;
    // Debugging info to help track layout issues
    console.log('[layout] updateHeroPadding -> header.offsetHeight=', h, 'hero.paddingTop=', hero.style.paddingTop);
};

// Run after full load to ensure fonts/images don't change header height afterwards
window.addEventListener('load', () => {
    updateHeroPadding();
    // small delayed recalculation for late layout shifts (fonts, rendering)
    setTimeout(updateHeroPadding, 200);
});

// Recalculate on resize
window.addEventListener('resize', updateHeroPadding);

// If ResizeObserver is available, watch the header for size changes
if (typeof ResizeObserver !== 'undefined' && header) {
    try {
        const ro = new ResizeObserver(() => updateHeroPadding());
        ro.observe(header);
    } catch (err) {
        // ignore if ResizeObserver not supported
    }
}



// Feedback Form Validation ------
const feedbackForm = document.getElementById('feedback-form');
const feedbackMessageDisplay = document.getElementById('feedback-message-display');

const feedbackInputs = {
    name: document.getElementById('feedback-name'),
    email: document.getElementById('feedback-email'),
    message: document.getElementById('feedback-message')
};

const errorMessages = {
    name: document.getElementById('name-error'),
    email: document.getElementById('email-error'),
    message: document.getElementById('message-error')
};

const validationRules = {
    name: (value) => {
        if (!value.trim()) return 'Lūdzu ievadiet savu vārdu un uzvārdu (caur atstarpi).';
        if (value.trim().length < 5) return 'Laukā jābūt vārdam, atstarpei un uzvārdam.';
        return '';
    },
    email: (value) => {
        if (!value.trim()) return 'Lūdzu ievadiet savu e-pasta adresi.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Lūdzu ievadiet derīgu e-pasta adresi ar @.';
        return '';
    },
    message: (value) => {
        if (!value.trim()) return 'Lūdzu ievadiet savu atsauksmi.';
        if (value.trim().length < 10) return 'Atsauksmei jābūt vismaz no 10 simboliem.';
        return '';
    }
};

const clearError = (fieldName) => {
    errorMessages[fieldName].textContent = '';
    feedbackInputs[fieldName].classList.remove('input-error');
};

const showError = (fieldName, message) => {
    errorMessages[fieldName].textContent = message;
    feedbackInputs[fieldName].classList.add('input-error');
};

const validateField = (fieldName) => {
    const value = feedbackInputs[fieldName].value;
    const error = validationRules[fieldName](value);
    
    if (error) {
        showError(fieldName, error);
        return false;
    } else {
        clearError(fieldName);
        return true;
    }
};

Object.keys(feedbackInputs).forEach(fieldName => {
    feedbackInputs[fieldName].addEventListener('blur', () => validateField(fieldName));
    feedbackInputs[fieldName].addEventListener('input', () => {
        if (errorMessages[fieldName].textContent) {
            validateField(fieldName);
        }
    });
    // Prevent form submission on Enter key in textarea/input
    feedbackInputs[fieldName].addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateField('name');
        const isEmailValid = validateField('email');
        const isMessageValid = validateField('message');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            const name = feedbackInputs.name.value;
            const email = feedbackInputs.email.value;
            const message = feedbackInputs.message.value;
            
            feedbackMessageDisplay.style.color = 'rgb(100, 200, 100)';
            feedbackMessageDisplay.textContent = 'Paldies par atsauksmi!';
            
            feedbackForm.reset();
            Object.keys(errorMessages).forEach(key => clearError(key));
            
            console.log('Feedback:', { name, email, message });
            
            setTimeout(() => {
                feedbackMessageDisplay.textContent = '';
            }, 5000);
        }
    });
}

