<img width="1461" height="832" alt="Screenshot 2026-07-29 at 11 44 47" src="https://github.com/user-attachments/assets/54e7bf19-af41-4586-bb92-a3cbcde1a2b7" />

# Smart Event Registration Portal

A full-stack MERN application designed for automated event discovery, secure attendee registration, and streamlined administrative management. 

**Live Demo:** [Insert your Render Frontend URL here]  
**Backend API:** [Insert your Render Backend URL here]

## 🚀 Features

* **Real-Time Capacity Tracking:** Dynamic validation prevents users from registering for sold-out events and updates database counters instantly.
* **Automated QR Code Ticketing:** Generates a unique, scannable QR code (encoded with the secure MongoDB Object ID) for each successful registration to prevent ticket fraud.
* **Admin Dashboard & CRUD:** Secure, role-based admin panel featuring inline editing to seamlessly update event details without page reloads.
* **1-Click CSV Export:** Custom backend API route that compiles attendee data and exports it instantly as a formatted CSV spreadsheet for offline organizer use.
* **Secure Authentication:** Protects administrative routes using JSON Web Tokens (JWT) and hashes all passwords using `bcryptjs`.
* **Responsive UI:** Fully responsive design built with Tailwind CSS, including an optimized dark mode toggle.

## 💻 Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* Axios (for API requests)
* React Router DOM

**Backend:**
* Node.js & Express.js
* MongoDB (Atlas) & Mongoose
* JWT (JSON Web Tokens)
* Bcryptjs (Password Hashing)
* Qrcode (Ticket Generation)

**Deployment:**
* Render (Web Service for Backend, Static Site for Frontend)

## 🛠️ Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Kepler989/smart-event-portal.git](https://github.com/Kepler989/smart-event-portal.git)
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a .env file in the backend directory and add:*
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```
   *Start the backend server:*
   ```bash
   node server.js
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a .env file in the frontend directory and add:*
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   *Start the development server:*
   ```bash
   npm run dev
   ```

## 🔐 Default Admin Access (Local Testing)
To access the Admin Dashboard locally, you can create a test admin account by sending a POST request to `/api/auth/register` with the following JSON body:
```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "Password123",
  "role": "admin"
}
```

## 👨‍💻 Author

**Swayamsiddha Mohapatra (Swayam)**  
* GitHub: [@Kepler989](https://github.com/Kepler989)  
* LinkedIn: [Swayamsiddha Mohapatra](https://www.linkedin.com/in/swayamsiddha-mohapatra-b52075320/)
