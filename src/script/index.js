// Themes -----------
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



// Languages -----------
function latvianMode() {
  console.log("latvian language default");
}

function englishMode() {
    console.log("english language in development");
}

function italianMode() {
    console.log("italian language in development");
}



// Load on home ------------
if (!window.location.hash) {
    window.location.hash = "#home";
}



// Header not overflowing onto content -----------
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



// Feedback Form Validation -----------
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
    if (!feedbackInputs[fieldName]) return;
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



// Forum posting-----------
const FORUM_KEY = 'forum-posts';

const $ = id => document.getElementById(id);
const escapeHtml = str => String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const getPosts = () => { try { return JSON.parse(localStorage.getItem(FORUM_KEY) || '[]'); } catch(e) { return []; } };
const savePosts = p => localStorage.setItem(FORUM_KEY, JSON.stringify(p));

const toggleModal = (id, show) => {
    const m = $(id);
    if (!m) return;
    if (show) {
        m.classList.add('show');
        m.setAttribute('aria-hidden', 'false');
    } else {
        m.classList.remove('show');
        m.setAttribute('aria-hidden', 'true');
    }
};

const openPostModal = () => { toggleModal('post-modal', true); $('post-title')?.focus(); };
const closePostModal = () => { toggleModal('post-modal', false); $('post-title').value = $('post-body').value = ''; window.currentEditIndex = null; };
const closeViewPostModal = () => toggleModal('view-post-modal', false);
const closeDeleteConfirmModal = () => { toggleModal('delete-confirm-modal', false); window.deletePostIndex = null; };

function renderPosts(posts) {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;
    if (!posts || posts.length === 0) {
        feed.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        return;
    }
    feed.innerHTML = posts.map((p, idx) => {
        const title = escapeHtml(p.title);
        const body = escapeHtml(p.body).replace(/\n/g, '<br/>');
        const time = new Date(p.created).toLocaleString();
        const editedLabel = p.edited ? '<span class="post-edited">(edited)</span>' : '';
        const likes = p.likes || 0;
        const dislikes = p.dislikes || 0;
        return `<article class="post-card">
            <h3>${title}</h3>
            <div class="post-date">${time}${editedLabel ? ' ' + editedLabel : ''}</div>
            <p>${body}</p>
            <div class="reactions">
                <button class="like-button" data-index="${idx}">👍 ${likes}</button>
                <button class="dislike-button" data-index="${idx}">👎 ${dislikes}</button>
            </div>
            <div class="post-actions">
                <button class="view-post-button" data-index="${idx}">Apskatīt</button>
                <button class="edit-post-button" data-index="${idx}">Rediģēt</button>
                <button class="delete-post-button" data-index="${idx}">Dzēst</button>
            </div>
        </article>`;
    }).join('\n');
}

const loadPosts = () => renderPosts(getPosts());

const submitPost = () => {
    const title = $('post-title')?.value.trim();
    const body = $('post-body')?.value.trim();
    if (!title || !body) return alert('Please enter a title and some content.');
    const posts = getPosts();
    const idx = window.currentEditIndex;
    if (idx !== undefined && idx !== null) {
        posts[idx] = { ...posts[idx], title, body, edited: true };
        window.currentEditIndex = null;
    } else {
        posts.unshift({ title, body, created: Date.now(), edited: false, likes: 0, dislikes: 0 });
    }
    savePosts(posts);
    renderPosts(posts);
    closePostModal();
};

const viewPost = idx => {
    const posts = getPosts();
    if (idx < 0 || idx >= posts.length) return;
    const p = posts[idx], time = new Date(p.created).toLocaleString();
    $('view-post-title').textContent = p.title;
    $('view-post-body').innerHTML = escapeHtml(p.body).replace(/\n/g, '<br/>');
    $('view-post-meta').textContent = `${time}${p.edited ? ' (edited)' : ''}`;
    toggleModal('view-post-modal', true);
};

const editPost = idx => {
    const posts = getPosts();
    if (idx < 0 || idx >= posts.length) return;
    $('post-title').value = posts[idx].title;
    $('post-body').value = posts[idx].body;
    window.currentEditIndex = idx;
    openPostModal();
};

const deletePost = idx => {
    const posts = getPosts();
    if (idx < 0 || idx >= posts.length) return;
    window.deletePostIndex = idx;
    toggleModal('delete-confirm-modal', true);
};

const confirmDelete = () => {
    const idx = window.deletePostIndex;
    const posts = getPosts();
    posts.splice(idx, 1);
    savePosts(posts);
    renderPosts(posts);
    closeDeleteConfirmModal();
};

const likePost = idx => {
    const posts = getPosts();
    if (idx < 0 || idx >= posts.length) return;
    posts[idx].likes = (posts[idx].likes || 0) + 1;
    savePosts(posts);
    renderPosts(posts);
};

const dislikePost = idx => {
    const posts = getPosts();
    if (idx < 0 || idx >= posts.length) return;
    posts[idx].dislikes = (posts[idx].dislikes || 0) + 1;
    savePosts(posts);
    renderPosts(posts);
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOMContentLoaded ===');
    console.log('Current page URL:', window.location.pathname);
    console.log('$ function:', typeof $);
    const feedEl = document.querySelector('#posts-feed') || document.querySelector('.posts-feed');
    console.log('posts-feed using $ function:', $('#posts-feed'));
    console.log('posts-feed using querySelector fallback:', feedEl);
    console.log('posts-feed using getElementById:', document.getElementById('posts-feed'));
    console.log('All elements with id posts-feed:', document.querySelectorAll('#posts-feed'));
    
    const button = el => el && el.addEventListener;
    console.log('new-post-button:', $('new-post-button'));
    button($('new-post-button')) && $('new-post-button').addEventListener('click', openPostModal);
    console.log('post-cancel:', $('post-cancel'));
    button($('post-cancel')) && $('post-cancel').addEventListener('click', closePostModal);
    button($('post-submit')) && $('post-submit').addEventListener('click', submitPost);
    button($('view-post-close')) && $('view-post-close').addEventListener('click', closeViewPostModal);
    button($('delete-confirm-button')) && $('delete-confirm-button').addEventListener('click', confirmDelete);
    button($('delete-cancel-button')) && $('delete-cancel-button').addEventListener('click', closeDeleteConfirmModal);
    
    const feed = document.querySelector('#posts-feed') || document.querySelector('.posts-feed');
    console.log('Setting up feed listener, feed element:', feed);
    if (feed) {
        feed.addEventListener('click', e => {
            console.log('Feed click event fired', e.target);
            const button = e.target.closest('button[data-index]');
            console.log('Closest button with data-index:', button);
            if (!button) return;
            const idx = parseInt(button.dataset.index);
            console.log('Button clicked with index:', idx, 'Classes:', button.className);
            if (button.classList.contains('view-post-button')) viewPost(idx);
            else if (button.classList.contains('edit-post-button')) editPost(idx);
            else if (button.classList.contains('delete-post-button')) deletePost(idx);
            else if (button.classList.contains('like-button')) likePost(idx);
            else if (button.classList.contains('dislike-button')) dislikePost(idx);
        });
    }
    
    ['post-modal', 'view-post-modal', 'delete-confirm-modal'].forEach(id => {
        const m = $(id);
        if (m) m.addEventListener('click', e => e.target.id === id && toggleModal(id, false));
    });
    
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closePostModal();
            closeViewPostModal();
            closeDeleteConfirmModal();
        }
    });

    loadPosts();
});

