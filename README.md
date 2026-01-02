# Contacts UI

A modern Angular application for managing contacts, built with Angular 21 and PrimeNG 21. This application integrates with the [contact-api](https://github.com/mark-dotcome/contact-api) backend for full CRUD operations with JWT authentication.

## Features

- User authentication (login/register) with JWT tokens
- Contact list with search, sorting, and pagination
- Create, edit, and delete contacts
- Light/dark theme toggle with persistence
- Responsive design for desktop and mobile
- Protected routes with authentication guards

## Technology Stack

- Angular 21
- PrimeNG 21 (UI components)
- PrimeFlex (CSS utilities)
- PrimeIcons (icons)
- TypeScript
- SCSS

## Prerequisites

- Node.js 18+
- npm or yarn
- Running instance of [contact-api](https://github.com/mark-dotcome/contact-api) backend

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

3. Configure the API URL (optional):
   Edit `src/environments/environment.ts` to point to your backend API:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
```

## Running Locally

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Building for Production

Build the application:
```bash
npm run build
```

The build artifacts will be stored in the `dist/contacts-ui` directory.

## Project Structure

```
contacts-ui/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Route guards (auth)
│   │   │   ├── interceptors/    # HTTP interceptors (auth token)
│   │   │   └── services/        # Core services (auth, contacts, theme)
│   │   ├── features/
│   │   │   ├── auth/            # Login and register components
│   │   │   └── contacts/        # Contact list and form components
│   │   ├── shared/
│   │   │   └── components/      # Shared components (layout)
│   │   ├── app.config.ts        # Application configuration
│   │   ├── app.routes.ts        # Route definitions
│   │   └── app.ts               # Root component
│   ├── environments/            # Environment configurations
│   └── styles.scss              # Global styles
├── angular.json                 # Angular CLI configuration
├── package.json                 # Dependencies
└── tsconfig.json               # TypeScript configuration
```

## Debugging

### Browser Developer Tools

1. Open the application in your browser
2. Press `F12` or right-click and select "Inspect" to open Developer Tools
3. Use the following tabs for debugging:
   - **Console**: View JavaScript errors and logs
   - **Network**: Monitor API requests and responses
   - **Application**: View localStorage (auth tokens, theme preference)

### Common Issues

1. **CORS errors**: Ensure the backend API has CORS configured to allow requests from your frontend URL.
2. **401 Unauthorized**: Your JWT token may have expired. Log out and log in again.
3. **API connection failed**: Verify the `apiUrl` in your environment file matches your running backend.

## Testing

Run unit tests:
```bash
npm test
```

## API Integration

This application integrates with the contact-api backend. The following endpoints are used:

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Contacts
- `GET /contacts/` - List all contacts
- `GET /contacts/search` - Search contacts with pagination
- `GET /contacts/{id}` - Get a single contact
- `POST /contacts/` - Create a new contact
- `PUT /contacts/{id}` - Update a contact
- `DELETE /contacts/{id}` - Delete a contact

## Related Repositories

- [contact-api](https://github.com/mark-dotcome/contact-api) - Python FastAPI backend with JWT authentication
- [contacts-java-api](https://github.com/mark-dotcome/contacts-java-api) - Java Spring Boot backend

## License

This project is open source.
