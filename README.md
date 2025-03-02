# Productivity Widget

A beautiful and intuitive productivity tracking application that helps you monitor your productive hours and manage tasks. Works offline by default, with optional cloud sync.

## Features

- 📅 Daily and monthly calendar views
- ⏰ Hour-by-hour productivity tracking
- ✅ Task management with completion status
- 🌓 Dark/light mode support
- 💾 Offline-first with local storage
- ☁️ Optional cloud sync
- 📱 Responsive design

## Tech Stack

- Frontend:
  - React
  - Tailwind CSS
  - Framer Motion
  - date-fns
  
- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/productivity-widget.git
   cd productivity-widget
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     NODE_ENV=development
     ```
   - Create a `.env` file in the frontend directory:
     ```
     REACT_APP_API_URL=http://localhost:5000/api
     ```

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Visit `http://localhost:3000` in your browser

## Deployment

### Backend Deployment (e.g., on Heroku)

1. Create a new Heroku app:
   ```bash
   heroku create your-app-name
   ```

2. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_production_mongodb_uri
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-url.com
   ```

3. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Frontend Deployment (e.g., on Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `build` directory to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `cd frontend && npm run build`
   - Set publish directory: `frontend/build`
   - Set environment variables in Netlify dashboard:
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```

## Security Considerations

1. Always use HTTPS in production
2. Keep your MongoDB URI private
3. Update the CORS configuration in backend/server.js
4. Regularly update dependencies
5. Monitor rate limiting and adjust as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
