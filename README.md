# PIXEL SAN - Gaming Website Frontend

A modern gaming website frontend built with vanilla JavaScript ES6+ modules, semantic HTML, and modular CSS architecture.

## ✨ Key Features

- **Modular JavaScript Architecture** - ES6+ modules with clean separation of concerns
- **Responsive Design** - Mobile-first approach with CSS Grid/Flexbox
- **Dark/Light Theme Support** - Automatic system preference detection with manual toggle
- **Accessibility Compliant** - WCAG 2.1 AA standards with keyboard navigation
- **Performance Optimized** - Lazy loading, intersection observers, efficient DOM manipulation
- **Gaming-Focused** - Robux selector, post categories, search functionality

## 📁 Project Structure

```
frontend/
├── assets/
│   ├── css/                  # Stylesheets (base, components, utilities)
│   └── images/               # Static image assets
├── js/
│   ├── config/               # App configuration and constants
│   ├── utils/                # Helper functions and DOM utilities
│   ├── modules/              # Feature modules (theme, navigation, search, etc.)
│   ├── api/                  # API client, endpoints, pagination
│   ├── *.js                  # Page-specific scripts
│   └── main.js               # Application entry point
├── *.html                    # HTML pages (index, category, post, legal, etc.)
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: CSS Grid, Flexbox, Custom Properties (CSS Variables)
- **Architecture**: Modular ES6 modules, Event-driven design
- **Performance**: Intersection Observer API, Lazy loading, Throttled events
- **Accessibility**: ARIA attributes, Keyboard navigation, Screen reader support

## 🚀 Quick Start

### Development Setup
1. **Serve the files with any static server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using VS Code Live Server extension
   ```

2. **Open browser** to `http://localhost:8000`

### Browser Requirements
- Modern browsers with ES6+ module support
- Chrome 61+, Firefox 60+, Safari 11+, Edge 16+

## 🎨 Core Features

### Theme System
- Auto-detects system preference (dark/light)
- Manual toggle with smooth transitions
- Persistent user preference storage

### Gaming Elements
- Robux selector with validation
- Game category navigation
- Post detail views with rich content
- Search functionality across content

### Responsive Design
- Mobile-first approach
- Fluid layouts with CSS Grid/Flexbox
- Optimized for touch interactions

## ⚙️ Configuration

### API Integration
Configure endpoints in `js/config/constants.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-api.com',
  ENDPOINTS: {
    POSTS: '/api/posts',
    CATEGORIES: '/api/categories'
  }
};
```

### Theming
Customize design tokens in `assets/css/base.css`:
```css
:root {
  --primary-color: #2dd4bf;
  --secondary-color: #ef4444;
  --font-family: 'Inter', sans-serif;
}
```

## 📈 Performance & SEO

### Performance Targets
- **Bundle Size**: ~25KB total (JS + CSS, gzipped)
- **First Contentful Paint**: < 1.5s
- **Lighthouse Score**: 90+ across all metrics

### SEO Features
- Semantic HTML structure
- Meta tags and Open Graph support
- Proper heading hierarchy
- Alt text for images
- Clean, crawlable URLs

## 🤝 Development

### Code Style
- ES6+ modern JavaScript
- Mobile-first responsive CSS
- Component-based architecture
- Accessibility-first approach

### Adding Features
1. Create module in appropriate `js/` directory
2. Export functionality with clear API
3. Import and initialize in `main.js`
4. Add corresponding CSS styles
5. Test across browsers and devices

### Project Pages
- **index.html** - Homepage with featured content
- **category.html** - Game category listings
- **post.html** - Blog post listings with pagination
- **post-detail.html** - Individual post view
- **contacto.html** - Contact page
- **Legal pages** - Privacy, terms, legal notice

## 📞 Support

- Check browser console for errors
- Verify ES6+ module support
- Ensure proper file paths for assets
- Test responsive design on mobile devices

---

**Built for the gaming community** 🎮
