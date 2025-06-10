Spring Boot & React - JWT Role-Based Authentication
This is a full-stack web application demonstrating a secure, token-based authentication system using JSON Web Tokens (JWT). The backend is built with Spring Boot and uses MongoDB for the database, while the frontend is a modern, responsive application built with React and Vite.
The application supports user registration, login, and role-based access control (Admin & User roles) to protect specific routes and API endpoints.
![alt text](https://img.shields.io/badge/License-MIT-yellow.svg)

![alt text](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)

![alt text](https://img.shields.io/badge/React-18.x-blue.svg)

![alt text](https://img.shields.io/badge/Vite-5.x-purple.svg)
📋 Table of Contents
Key Features
Technology Stack
Project Structure
Prerequisites
Getting Started
Backend Setup (Spring Boot)
Frontend Setup (React + Vite)
Configuration
Running the Application
API Endpoints
Authentication Flow
Screenshots
Contributing
License
✨ Key Features
Secure JWT Authentication: Stateless authentication using HttpOnly cookies or Authorization headers.
Role-Based Authorization: Differentiated access levels for ROLE_USER and ROLE_ADMIN.
User & Admin Roles: Seeded roles in the database upon application startup.
Login & Registration: Endpoints for user creation and sign-in.
Frontend with React & Vite: A fast, modern UI with a great developer experience.
State Management with React Context API: Centralized AuthContext to manage user authentication state globally.
Protected Routes: Client-side route protection to prevent unauthorized access to pages.
MongoDB Integration: Flexible and scalable NoSQL database for storing user and role data.
CORS Configuration: Properly configured to allow communication between the frontend and backend.
🛠️ Technology Stack
Backend (Spring Boot)	Frontend (React + Vite)	Database
Java 17+	React 18+	MongoDB Atlas/Local
Spring Boot 3.x	Vite	
Spring Security 6.x	React Router DOM	
Spring Data MongoDB	Axios	
JJWT (Java JWT)	CSS Modules / Tailwind CSS	
Maven		
📁 Project Structure
The repository is structured as a monorepo with separate directories for the backend and frontend.
/
├── backend/                  # Spring Boot Application
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
└── README.md
Use code with caution.
✅ Prerequisites
Before you begin, ensure you have the following installed on your system:
JDK 17 or higher: OpenJDK
Maven: Apache Maven
Node.js v18.x or higher: Node.js
MongoDB: A running instance of MongoDB (either local or a cloud service like MongoDB Atlas).
🚀 Getting Started
Follow these instructions to get the project up and running on your local machine.
1. Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Use code with caution.
Bash
🖥️ Backend Setup (Spring Boot)
Navigate to the backend directory:
cd backend
Use code with caution.
Bash
Configure the application:
Open src/main/resources/application.properties and update the MongoDB connection string and JWT secret.
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/your_db_name

# JWT Configuration
app.jwt.secret======================YourSuperSecretKey=====================
app.jwt.expiration-ms=86400000 # 24 hours
Use code with caution.
Properties
Security Note: It's highly recommended to use environment variables for sensitive data like JWT secrets and database credentials in a production environment.
Install dependencies and build:
Maven will automatically download all the required dependencies.
Run the backend server:
mvn spring-boot:run
Use code with caution.
Bash
The backend server will start on http://localhost:8080.
⚛️ Frontend Setup (React + Vite)
Navigate to the frontend directory (from the root):
cd frontend
Use code with caution.
Bash
Install dependencies:
npm install
Use code with caution.
Bash
Create an environment file:
Create a .env file in the frontend directory and add the base URL for your backend API.
VITE_API_BASE_URL=http://localhost:8080/api
Use code with caution.
Env
This variable is used by Axios to make requests to the Spring Boot backend.
Run the frontend development server:
npm run dev
Use code with caution.
Bash
The React application will be available at http://localhost:5173 (or another port if 5173 is in use).
⚙️ Configuration
Backend Port: The default port is 8080. You can change this in application.properties by adding server.port=NEW_PORT.
Frontend Port: The default Vite port is 5173.
JWT Secret & Expiration: Configure in backend/src/main/resources/application.properties. A strong, long, and random secret is crucial for security.
CORS: The CORS configuration is located in the backend's WebSecurityConfig.java file. By default, it's set to allow requests from http://localhost:5173. You'll need to update this for your production frontend URL.
🏃 Running the Application
Start the MongoDB database server.
Run the Backend server from the backend directory: mvn spring-boot:run.
Run the Frontend server from the frontend directory: npm run dev.
Open your browser and navigate to http://localhost:5173.
📡 API Endpoints
Here is a list of the core API endpoints provided by the backend.
Method	Endpoint	Description	Access
POST	/api/auth/register	Register a new user.	Public
POST	/api/auth/login	Authenticate a user and get a JWT.	Public
GET	/api/test/all	Access public content.	Public
GET	/api/test/user	Access content for logged-in users.	User, Admin
GET	/api/test/admin	Access content for admins only.	Admin
🔄 Authentication Flow
Registration: A new user signs up via the /register page. The data is sent to /api/auth/register, and a new user document with the ROLE_USER is created in MongoDB.
Login: The user enters their credentials on the /login page. The data is sent to /api/auth/login.
Token Generation: If credentials are valid, the Spring Boot backend generates a JWT containing the user's ID, username, and roles.
Token Storage: The JWT is sent back to the React client. The AuthContext stores this token in localStorage and updates the application's authentication state.
Authenticated Requests: For any subsequent requests to protected API endpoints, Axios attaches the JWT to the Authorization: Bearer <token> header.
Backend Validation: Spring Security's JWT filter intercepts each request, validates the token, and sets the user's Authentication object in the security context. If the token is invalid or the user lacks the required role, a 401 Unauthorized or 403 Forbidden error is returned.
Protected Routes (Frontend): The ProtectedRoute component in React checks if a valid token exists in AuthContext. If not, it redirects the user to the login page.
🖼️ Screenshots
<!-- Add screenshots of your application to make the README more engaging. -->
<!-- Example: -->
Login Page	Register Page	User Dashboard
![alt text](Images/Screenshot2025-06-10224125.png)
![alt text](link-to-your-register-screenshot.png)
![alt text](link-to-your-dashboard-screenshot.png)
🤝 Contributing
Contributions are welcome! If you'd like to contribute, please follow these steps:
Fork the repository.
Create a new branch (git checkout -b feature/your-feature-name).
Make your changes.
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a Pull Request.
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
