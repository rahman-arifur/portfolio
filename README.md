# Portfolio Website

A complete portfolio website built with HTML, CSS, JavaScript, and PHP featuring dynamic content management and responsive design.

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with smooth animations
- **Interactive Elements**: Hover effects, smooth scrolling, and dynamic loading
- **Modern UI**: Clean and professional design without external CSS frameworks
- **Performance Optimized**: Optimized loading and smooth transitions

### Backend
- **Dynamic Content**: Projects and contests loaded from database
- **Contact Form**: Email integration with database storage
- **Admin Panel**: Complete CRUD operations for content management
- **Security**: Input sanitization and validation

### Sections
- **Hero**: Introduction with call-to-action buttons
- **About**: Skills showcase with animated icons
- **Projects**: Dynamic project grid with "See More" functionality (max 4 initial display)
- **Contests**: Contest achievements with "See More" functionality (max 4 initial display)
- **Contact**: Contact information and message form

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Icons**: Font Awesome
- **Email**: PHP mail() function

## Setup Instructions

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) or XAMPP/WAMP for local development

### File Structure
```
portfolio/
├── index.html              # Main portfolio page
├── admin/
│   └── index.html          # Admin panel
├── css/
│   ├── style.css           # Main stylesheet
│   └── admin.css           # Admin panel styles
├── js/
│   ├── script.js           # Main JavaScript
│   └── admin.js            # Admin panel JavaScript
├── php/
│   ├── config.php          # Database configuration
│   ├── get_projects.php    # Fetch projects API
│   ├── get_contests.php    # Fetch contests API
│   ├── send_message.php    # Contact form handler
│   └── admin/              # Admin CRUD operations
│       ├── get_projects.php
│       ├── save_project.php
│       ├── delete_project.php
│       ├── get_contests.php
│       ├── save_contest.php
│       ├── delete_contest.php
│       ├── get_messages.php
│       ├── get_message.php
│       └── delete_message.php
└── database.sql            # Database schema and sample data
```

### Admin Panel
1. Visit `admin/index.html`
2. Login with admin credentials
3. Manage projects, contests, and view messages
4. Add, edit, or delete content as needed

### Adding Content

#### Projects
- Name (required)
- Description (required)
- Technologies (comma-separated)
- GitHub Link (optional)
- Demo Link (optional)

#### Contests
- Contest Name (required)
- Rank (required)
- Team Name (optional)
- Standing Link (optional)

## Customization

### Styling
- Modify `css/style.css` for main website styling
- Update color scheme by changing CSS custom properties
- Adjust animations and transitions as needed

### Content Limits
- Change the `itemsPerPage` variable in `js/script.js` to modify how many items show initially
- Update responsive breakpoints in CSS media queries

### Security
- Implement proper session management for admin authentication
- Add CSRF protection for form submissions
- Use prepared statements for all database queries (already implemented)
- Consider implementing rate limiting for contact form

## Support
For support or questions, please use the contact form on the website or create an issue in the repository.
