# Native SSR Project

This is a simple server-side rendering (SSR) project built with Node.js and Handlebars.

## Features

- Server-side rendering with Handlebars templates
- Express.js server
- Static file serving
- Responsive design

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Development

For development with auto-restart:
```
npm run dev
```

## Project Structure

- `server/` - Contains the Express server implementation
- `views/` - Handlebars templates
- `public/` - Static assets (CSS, JS, images)

## How It Works

1. The Express server handles all routes
2. For each request, it compiles a Handlebars template with dynamic data
3. The rendered HTML is sent to the client
4. Static assets are served from the `public/` directory