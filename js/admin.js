// Admin Panel JavaScript

// Global variables
let currentUser = null;
let projects = [];
let contests = [];
let messages = [];

// Admin credentials (in a real app, this should be server-side authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAuthStatus();
});

// Initialize event listeners
function initializeEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Add buttons
    document.getElementById('add-project-btn').addEventListener('click', () => openProjectModal());
    document.getElementById('add-contest-btn').addEventListener('click', () => openContestModal());
    
    // Form submissions
    document.getElementById('project-form').addEventListener('submit', handleProjectSubmit);
    document.getElementById('contest-form').addEventListener('submit', handleContestSubmit);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        currentUser = { username };
        localStorage.setItem('adminAuth', JSON.stringify(currentUser));
        showAdminPanel();
        errorDiv.style.display = 'none';
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('adminAuth');
    showLoginScreen();
}

function checkAuthStatus() {
    const stored = localStorage.getItem('adminAuth');
    if (stored) {
        currentUser = JSON.parse(stored);
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadAllData();
}

// Tab switching
function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load data for the current tab
    switch(tabName) {
        case 'projects':
            loadProjects();
            break;
        case 'contests':
            loadContests();
            break;
        case 'messages':
            loadMessages();
            break;
    }
}

// Data loading functions
async function loadAllData() {
    showLoading(true);
    try {
        await Promise.all([
            loadProjects(),
            loadContests(),
            loadMessages()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data');
    }
    showLoading(false);
}

async function loadProjects() {
    try {
        const response = await fetch('../php/admin/get_projects.php');
        const data = await response.json();
        
        if (data.success) {
            projects = data.data;
            renderProjectsTable();
        } else {
            showError('Failed to load projects: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showError('Failed to load projects');
    }
}

async function loadContests() {
    try {
        const response = await fetch('../php/admin/get_contests.php');
        const data = await response.json();
        
        if (data.success) {
            contests = data.data;
            renderContestsTable();
        } else {
            showError('Failed to load contests: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading contests:', error);
        showError('Failed to load contests');
    }
}

async function loadMessages() {
    try {
        const response = await fetch('../php/admin/get_messages.php');
        const data = await response.json();
        
        if (data.success) {
            messages = data.data;
            renderMessagesTable();
        } else {
            showError('Failed to load messages: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        showError('Failed to load messages');
    }
}

// Table rendering functions
function renderProjectsTable() {
    const tbody = document.querySelector('#projects-table tbody');
    tbody.innerHTML = '';
    
    if (projects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div>
                        <i class="fas fa-code"></i>
                        <h3>No projects found</h3>
                        <p>Click "Add New Project" to create your first project.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    projects.forEach(project => {
        const technologies = Array.isArray(project.technologies) 
            ? project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')
            : '';
        
        const githubLink = project.github_link 
            ? `<a href="${project.github_link}" target="_blank" class="link-btn"><i class="fab fa-github"></i> GitHub</a>`
            : '';
        
        const demoLink = project.demo_link 
            ? `<a href="${project.demo_link}" target="_blank" class="link-btn"><i class="fas fa-external-link-alt"></i> Demo</a>`
            : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.id}</td>
            <td><strong>${escapeHtml(project.name)}</strong></td>
            <td>${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</td>
            <td><div class="technologies-list">${technologies}</div></td>
            <td>${githubLink}${demoLink}</td>
            <td>${formatDate(project.created_at)}</td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-small" onclick="editProject(${project.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProject(${project.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderContestsTable() {
    const tbody = document.querySelector('#contests-table tbody');
    tbody.innerHTML = '';
    
    if (contests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div>
                        <i class="fas fa-trophy"></i>
                        <h3>No contests found</h3>
                        <p>Click "Add New Contest" to add your first contest achievement.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    contests.forEach(contest => {
        const standingLink = contest.standing_link 
            ? `<a href="${contest.standing_link}" target="_blank" class="link-btn"><i class="fas fa-external-link-alt"></i> View</a>`
            : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contest.id}</td>
            <td><strong>${escapeHtml(contest.contest_name)}</strong></td>
            <td><span class="tech-tag">${escapeHtml(contest.rank)}</span></td>
            <td>${contest.team_name ? escapeHtml(contest.team_name) : '<em>Solo</em>'}</td>
            <td>${standingLink}</td>
            <td>${formatDate(contest.created_at)}</td>
            <td class="action-buttons">
                <button class="btn btn-warning btn-small" onclick="editContest(${contest.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteContest(${contest.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderMessagesTable() {
    const tbody = document.querySelector('#messages-table tbody');
    tbody.innerHTML = '';
    
    if (messages.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div>
                        <i class="fas fa-envelope"></i>
                        <h3>No messages found</h3>
                        <p>Messages from your contact form will appear here.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    messages.forEach(message => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${message.id}</td>
            <td><strong>${escapeHtml(message.name)}</strong></td>
            <td>${escapeHtml(message.email)}</td>
            <td>${escapeHtml(message.subject)}</td>
            <td>${escapeHtml(message.message.substring(0, 50))}${message.message.length > 50 ? '...' : ''}</td>
            <td>${formatDate(message.created_at)}</td>
            <td class="action-buttons">
                <button class="btn btn-success btn-small" onclick="viewMessage(${message.id})">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteMessage(${message.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal functions
function openProjectModal(project = null) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('project-modal-title');
    const form = document.getElementById('project-form');
    
    if (project) {
        title.textContent = 'Edit Project';
        populateProjectForm(project);
    } else {
        title.textContent = 'Add New Project';
        form.reset();
        document.getElementById('project-id').value = '';
    }
    
    modal.classList.add('active');
}

function openContestModal(contest = null) {
    const modal = document.getElementById('contest-modal');
    const title = document.getElementById('contest-modal-title');
    const form = document.getElementById('contest-form');
    
    if (contest) {
        title.textContent = 'Edit Contest';
        populateContestForm(contest);
    } else {
        title.textContent = 'Add New Contest';
        form.reset();
        document.getElementById('contest-id').value = '';
    }
    
    modal.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function populateProjectForm(project) {
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-name').value = project.name;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-technologies').value = Array.isArray(project.technologies) 
        ? project.technologies.join(', ') : '';
    document.getElementById('project-github').value = project.github_link || '';
    document.getElementById('project-demo').value = project.demo_link || '';
}

function populateContestForm(contest) {
    document.getElementById('contest-id').value = contest.id;
    document.getElementById('contest-name').value = contest.contest_name;
    document.getElementById('contest-rank').value = contest.rank;
    document.getElementById('contest-team').value = contest.team_name || '';
    document.getElementById('contest-standing').value = contest.standing_link || '';
}

// Form submission handlers
async function handleProjectSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const technologies = formData.get('technologies');
    
    const projectData = {
        id: formData.get('id') || null,
        name: formData.get('name'),
        description: formData.get('description'),
        technologies: technologies ? technologies.split(',').map(t => t.trim()) : [],
        github_link: formData.get('github_link') || null,
        demo_link: formData.get('demo_link') || null
    };
    
    showLoading(true);
    
    try {
        const response = await fetch('../php/admin/save_project.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.data.message);
            closeModal('project-modal');
            await loadProjects();
        } else {
            showError('Failed to save project: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving project:', error);
        showError('Failed to save project');
    }
    
    showLoading(false);
}

async function handleContestSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const contestData = {
        id: formData.get('id') || null,
        contest_name: formData.get('contest_name'),
        rank: formData.get('rank'),
        team_name: formData.get('team_name') || null,
        standing_link: formData.get('standing_link') || null
    };
    
    showLoading(true);
    
    try {
        const response = await fetch('../php/admin/save_contest.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contestData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.data.message);
            closeModal('contest-modal');
            await loadContests();
        } else {
            showError('Failed to save contest: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving contest:', error);
        showError('Failed to save contest');
    }
    
    showLoading(false);
}

// CRUD operations
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        openProjectModal(project);
    }
}

function editContest(id) {
    const contest = contests.find(c => c.id === id);
    if (contest) {
        openContestModal(contest);
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('../php/admin/delete_project.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.data.message);
            await loadProjects();
        } else {
            showError('Failed to delete project: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showError('Failed to delete project');
    }
    
    showLoading(false);
}

async function deleteContest(id) {
    if (!confirm('Are you sure you want to delete this contest?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('../php/admin/delete_contest.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.data.message);
            await loadContests();
        } else {
            showError('Failed to delete contest: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting contest:', error);
        showError('Failed to delete contest');
    }
    
    showLoading(false);
}

async function viewMessage(id) {
    try {
        const response = await fetch(`../php/admin/get_message.php?id=${id}`);
        const data = await response.json();
        
        if (data.success) {
            showMessageModal(data.data);
        } else {
            showError('Failed to load message: ' + data.error);
        }
    } catch (error) {
        console.error('Error loading message:', error);
        showError('Failed to load message');
    }
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch('../php/admin/delete_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(data.data.message);
            await loadMessages();
        } else {
            showError('Failed to delete message: ' + data.error);
        }
    } catch (error) {
        console.error('Error deleting message:', error);
        showError('Failed to delete message');
    }
    
    showLoading(false);
}

function showMessageModal(message) {
    const modal = document.getElementById('message-modal');
    const details = document.getElementById('message-details');
    
    details.innerHTML = `
        <div class="message-field">
            <label>From:</label>
            <div class="content">${escapeHtml(message.name)} &lt;${escapeHtml(message.email)}&gt;</div>
        </div>
        <div class="message-field">
            <label>Subject:</label>
            <div class="content">${escapeHtml(message.subject)}</div>
        </div>
        <div class="message-field">
            <label>Message:</label>
            <div class="content">${escapeHtml(message.message).replace(/\n/g, '<br>')}</div>
        </div>
        <div class="message-field">
            <label>Received:</label>
            <div class="content">${formatDate(message.created_at)}</div>
        </div>
        <div class="form-actions">
            <button class="btn btn-danger" onclick="deleteMessage(${message.id}); closeModal('message-modal')">
                <i class="fas fa-trash"></i> Delete Message
            </button>
            <button class="btn btn-secondary" onclick="closeModal('message-modal')">Close</button>
        </div>
    `;
    
    modal.classList.add('active');
}

// Utility functions
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const main = document.querySelector('.admin-main');
    main.insertBefore(successDiv, main.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;
    
    const main = document.querySelector('.admin-main');
    main.insertBefore(errorDiv, main.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
