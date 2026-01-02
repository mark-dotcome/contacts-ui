# Contacts UI

UI mockups for the Contacts App built with HTML, CSS, and PrimeNG styling. These mockups demonstrate the user interface for a contact management application with support for light and dark themes.

## Features

- Login screen with email/password authentication
- Contact list with search, filter, and pagination
- Create new contact form
- Edit contact form with audit trail information
- Delete contact confirmation modal
- Light and dark theme toggle (persisted in localStorage)
- Responsive design for desktop and mobile devices

## Screens

| Screen | File | Description |
|--------|------|-------------|
| Login | `src/login.html` | User authentication screen |
| Contact List | `src/contact-list.html` | View all contacts with search and pagination |
| Create Contact | `src/create-contact.html` | Form to add a new contact |
| Edit Contact | `src/edit-contact.html` | Form to update existing contact |
| Delete Contact | `src/delete-contact.html` | Confirmation modal for deleting a contact |

## Prerequisites

- Node.js 16+ (for development server)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mark-dotcome/contacts-ui.git
cd contacts-ui
```

2. Install dependencies:
```bash
npm install
```

## Running Locally

### Development Mode

Start the development server:
```bash
npm start
```

Or using the dev script:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Available Pages

Once the server is running, you can access the following pages:

- Login: `http://localhost:3000/login.html`
- Contact List: `http://localhost:3000/contact-list.html`
- Create Contact: `http://localhost:3000/create-contact.html`
- Edit Contact: `http://localhost:3000/edit-contact.html`
- Delete Contact: `http://localhost:3000/delete-contact.html`

## Building for Production

To build the project for production:
```bash
npm run build
```

This copies all source files to the `dist/` directory, which can be deployed to any static file hosting service.

## Debugging

### Browser Developer Tools

1. Open any page in your browser
2. Press `F12` or right-click and select "Inspect" to open Developer Tools
3. Use the following tabs for debugging:
   - **Elements**: Inspect and modify HTML/CSS in real-time
   - **Console**: View JavaScript errors and logs
   - **Network**: Monitor network requests (useful when connecting to the API)
   - **Application**: View localStorage (theme preference is stored here)

### Theme Toggle Debugging

The theme preference is stored in `localStorage` under the key `theme`. You can manually set it in the browser console:
```javascript
localStorage.setItem('theme', 'dark');  // Set dark theme
localStorage.setItem('theme', 'light'); // Set light theme
location.reload();                       // Reload to apply
```

### Responsive Design Testing

1. Open Developer Tools (F12)
2. Click the device toggle icon (or press `Ctrl+Shift+M`)
3. Select a mobile device preset or set custom dimensions
4. The UI will automatically adapt to the viewport size

## Testing

### Manual Testing

1. Start the development server:
```bash
npm start
```

2. Open each page and verify:
   - All form fields render correctly
   - Theme toggle switches between light and dark modes
   - Theme preference persists after page reload
   - Responsive layout works on mobile viewports
   - All buttons and links are clickable

### Visual Testing Checklist

- [ ] Login page displays correctly in light mode
- [ ] Login page displays correctly in dark mode
- [ ] Contact list shows sample data with pagination
- [ ] Create contact form has all required fields
- [ ] Edit contact form shows pre-populated data
- [ ] Delete confirmation modal appears correctly
- [ ] Theme toggle works on all pages
- [ ] Mobile responsive layout works on all pages

### Testing with the Backend API

These mockups are designed to work with the [contact-api](https://github.com/mark-dotcome/contact-api) backend. To test with the actual API:

1. Start the backend API (see contact-api README)
2. Update the JavaScript in each HTML file to make actual API calls
3. Replace mock data with API responses

## Project Structure

```
contacts-ui/
├── src/
│   ├── login.html           # Login screen
│   ├── contact-list.html    # Contact list with search/pagination
│   ├── create-contact.html  # Create new contact form
│   ├── edit-contact.html    # Edit existing contact form
│   └── delete-contact.html  # Delete confirmation modal
├── package.json             # Project configuration
└── README.md               # This file
```

## Technology Stack

- HTML5
- CSS3 with CSS Variables for theming
- PrimeNG CDN for UI components styling
- PrimeFlex CDN for responsive grid layout
- PrimeIcons CDN for icons
- Vanilla JavaScript for theme toggle functionality

## Theme Customization

The application uses CSS variables for theming. Key variables include:

### Light Theme
- Background: `#f8fafc`
- Card Background: `#ffffff`
- Text: `#1e293b`
- Primary Color: `#6366f1` (Indigo)

### Dark Theme
- Background: `#0f172a`
- Card Background: `#1e293b`
- Text: `#f1f5f9`
- Primary Color: `#818cf8` (Light Indigo)

## Related Repositories

- [contact-api](https://github.com/mark-dotcome/contact-api) - Python FastAPI backend with JWT authentication
- [contacts-java-api](https://github.com/mark-dotcome/contacts-java-api) - Java Spring Boot backend

## License

This project is open source.
