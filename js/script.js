// Global variables
let allProjects = [];
let allContests = [];
let projectsShown = 0;
let contestsShown = 0;
const itemsPerPage = 4;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadProjects();
    loadContests();
    initializeContactForm();
    initializeScrollAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Load projects from database
async function loadProjects() {
    try {
        const response = await fetch('php/get_projects.php');
        const data = await response.json();;

        if (data.success) {
            allProjects = data.data.projects;
            displayProjects();
        } else {
            console.error('Failed to load projects:', data.error);
            displayProjectsError();
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayProjectsError();
    }
}

// Display projects
function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const seeMoreBtn = document.getElementById('projects-see-more');
    
    // Clear existing projects
    projectsGrid.innerHTML = '';
    
    // Show first batch of projects
    const projectsToShow = allProjects.slice(0, itemsPerPage);
    projectsShown = projectsToShow.length;
    
    projectsToShow.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
    
    // Show/hide "See More" button
    if (allProjects.length > itemsPerPage) {
        seeMoreBtn.style.display = 'block';
    } else {
        seeMoreBtn.style.display = 'none';
    }
    
    // Add animation to project cards
    animateElements('.project-card');
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${Math.random() * 0.5}s`;
    
    // Parse technologies if it's a JSON string
    let technologies = [];
    try {
        technologies = typeof project.technologies === 'string' 
            ? JSON.parse(project.technologies) 
            : project.technologies || [];
    } catch (e) {
        technologies = project.technologies ? project.technologies.split(',') : [];
    }
    
    card.innerHTML = `
        <div class="project-image">
            <i class="fas fa-code"></i>
        </div>
        <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.name)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tech">
                ${technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech.trim())}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demo_link ? `<a href="${escapeHtml(project.demo_link)}" target="_blank" class="project-link">Live Demo</a>` : ''}
                ${project.github_link ? `<a href="${escapeHtml(project.github_link)}" target="_blank" class="project-link">GitHub</a>` : ''}
            </div>
        </div>
    `;
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    return card;
}

// Load more projects
function loadMoreProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const seeMoreBtn = document.getElementById('projects-see-more');
    
    const nextBatch = allProjects.slice(projectsShown, projectsShown + itemsPerPage);
    
    nextBatch.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(30px)';
        projectsGrid.appendChild(projectCard);
        
        // Animate in
        setTimeout(() => {
            projectCard.style.transition = 'all 0.5s ease';
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    projectsShown += nextBatch.length;
    
    // Hide button if all projects are shown
    if (projectsShown >= allProjects.length) {
        seeMoreBtn.style.display = 'none';
    }
}

// Display projects error
function displayProjectsError() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p style="color: #666; font-size: 1.1rem;">Unable to load projects at the moment. Please try again later.</p>
        </div>
    `;
}

// Load contests from database
async function loadContests() {
    try {
        const response = await fetch('php/get_contests.php');
        const data = await response.json();
        
        if (data.success) {
            allContests = data.data.contests;
            displayContests();
        } else {
            console.error('Failed to load contests:', data.error);
            displayContestsError();
        }
    } catch (error) {
        console.error('Error loading contests:', error);
        displayContestsError();
    }
}

// Display contests
function displayContests() {
    const contestsGrid = document.getElementById('contests-grid');
    const seeMoreBtn = document.getElementById('contests-see-more');
    
    // Clear existing contests
    contestsGrid.innerHTML = '';
    
    // Show first batch of contests
    const contestsToShow = allContests.slice(0, itemsPerPage);
    contestsShown = contestsToShow.length;
    
    contestsToShow.forEach(contest => {
        const contestCard = createContestCard(contest);
        contestsGrid.appendChild(contestCard);
    });
    
    // Show/hide "See More" button
    if (allContests.length > itemsPerPage) {
        seeMoreBtn.style.display = 'block';
    } else {
        seeMoreBtn.style.display = 'none';
    }
    
    // Add animation to contest cards
    animateElements('.contest-card');
}

// Create contest card element
function createContestCard(contest) {
    const card = document.createElement('div');
    card.className = 'contest-card';
    card.style.animationDelay = `${Math.random() * 0.5}s`;
    
    card.innerHTML = `
        <h3 class="contest-name">${escapeHtml(contest.contest_name)}</h3>
        <div class="contest-rank">Rank: ${escapeHtml(contest.rank)}</div>
        ${contest.team_name ? `<div class="contest-team">Team: ${escapeHtml(contest.team_name)}</div>` : ''}
        ${contest.standing_link ? `<a href="${escapeHtml(contest.standing_link)}" target="_blank" class="contest-link">View Standings</a>` : ''}
    `;
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
    });
    
    return card;
}

// Load more contests
function loadMoreContests() {
    const contestsGrid = document.getElementById('contests-grid');
    const seeMoreBtn = document.getElementById('contests-see-more');
    
    const nextBatch = allContests.slice(contestsShown, contestsShown + itemsPerPage);
    
    nextBatch.forEach((contest, index) => {
        const contestCard = createContestCard(contest);
        contestCard.style.opacity = '0';
        contestCard.style.transform = 'translateY(30px)';
        contestsGrid.appendChild(contestCard);
        
        // Animate in
        setTimeout(() => {
            contestCard.style.transition = 'all 0.5s ease';
            contestCard.style.opacity = '1';
            contestCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    contestsShown += nextBatch.length;
    
    // Hide button if all contests are shown
    if (contestsShown >= allContests.length) {
        seeMoreBtn.style.display = 'none';
    }
}

// Display contests error
function displayContestsError() {
    const contestsGrid = document.getElementById('contests-grid');
    contestsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <p style="color: #666; font-size: 1.1rem;">Unable to load contests at the moment. Please try again later.</p>
        </div>
    `;
}

// Initialize contact form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            const response = await fetch('php/send_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const data_respone = await response.json();
            
            if (data_respone.success) {
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                showMessage(data_respone.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        } finally {
            // Restore button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.skill-item, .about-text, .section-title');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Animate elements
function animateElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth button animations
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // Create ripple effect
        const btn = e.target;
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.backgroundPosition = `center ${rate}px`;
    }
});

// Add loading animation for dynamic content
function showLoadingSpinner(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
            <div class="loading" style="width: 40px; height: 40px; border-width: 4px;"></div>
        </div>
    `;
}

// Preload images and optimize performance
function preloadImages() {
    const images = [
        // Add any image URLs that need to be preloaded
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const keyboardStyle = document.createElement('style');
keyboardStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #3498db !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(keyboardStyle);
