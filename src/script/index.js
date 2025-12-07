// Themes ------
function setTheme(theme) {
  document.body.classList.remove('light-mode', 'dark-mode');
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
}

function lightMode() {
  setTheme('light-mode');
}

function darkMode() {
  setTheme('dark-mode');
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode';
  setTheme(saved || preferred);
});



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

const updateHeroSpacing = () => {
    if (!header || !hero) return;
    const h = header.offsetHeight;
    hero.style.marginTop = `${h}px`;
    document.documentElement.style.setProperty('--header-height', `${h}px`);
};

document.addEventListener('DOMContentLoaded', () => {
    updateHeroSpacing();
    setTimeout(updateHeroSpacing, 100);
    setTimeout(updateHeroSpacing, 300);
});

window.addEventListener('load', updateHeroSpacing);
window.addEventListener('resize', updateHeroSpacing);

if (typeof ResizeObserver !== 'undefined' && header) {
        const ro = new ResizeObserver(() => updateHeroSpacing());
        ro.observe(header);
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

// Simple Forum Posting (no accounts) ------
const FORUM_KEY = 'forum-posts';

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function openPostModal() {
    const modal = document.getElementById('post-modal');
    if (!modal) return;
    modal.style.display = '';
    modal.setAttribute('aria-hidden', 'false');
    const title = document.getElementById('post-title');
    if (title) title.focus();
}

function closePostModal() {
    const modal = document.getElementById('post-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    const title = document.getElementById('post-title');
    const body = document.getElementById('post-body');
    if (title) title.value = '';
    if (body) body.value = '';
}

function getPosts() {
    try {
        return JSON.parse(localStorage.getItem(FORUM_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function savePosts(posts) {
    localStorage.setItem(FORUM_KEY, JSON.stringify(posts));
}

function renderPosts(posts) {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;
    if (!posts || posts.length === 0) {
        feed.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        return;
    }
    feed.innerHTML = posts.map(p => {
        const title = escapeHtml(p.title);
        const body = escapeHtml(p.body).replace(/\n/g, '<br/>');
        const time = new Date(p.created).toLocaleString();
        return `<article class="post"><h3>${title}</h3><div class="post-body">${body}</div><div class="meta">${time}</div></article>`;
    }).join('\n');
}

function loadPosts() {
    const posts = getPosts();
    renderPosts(posts);
}

function submitPost() {
    const titleEl = document.getElementById('post-title');
    const bodyEl = document.getElementById('post-body');
    if (!titleEl || !bodyEl) return;
    const title = titleEl.value.trim();
    const body = bodyEl.value.trim();
    if (!title || !body) {
        alert('Please enter a title and some content.');
        return;
    }
    const posts = getPosts();
    posts.unshift({ title, body, created: Date.now() });
    savePosts(posts);
    renderPosts(posts);
    closePostModal();
}

// Wire up forum UI if present
document.addEventListener('DOMContentLoaded', () => {
    const newBtn = document.getElementById('new-post-button');
    if (newBtn) newBtn.addEventListener('click', openPostModal);

    const cancel = document.getElementById('post-cancel');
    if (cancel) cancel.addEventListener('click', closePostModal);

    const submit = document.getElementById('post-submit');
    if (submit) submit.addEventListener('click', submitPost);

    // Close modal on backdrop click
    const modal = document.getElementById('post-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closePostModal();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePostModal();
    });

    loadPosts();
});

