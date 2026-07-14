GVCC Learning Portal
Learn. Watch. Bookmark. Succeed.
Interview Community is a premium, full-stack video learning platform designed for modern engineers. It features a sleek Dark-Mode Landing Page and a highly productive Light-Mode Dashboard with time-stamped bookmarking, progress tracking, and professional-grade security.

<img width="1536" height="1024" alt="home and login " src="https://github.com/user-attachments/assets/218ed99a-0be0-48b8-bad2-46307239a772" />


🚀 Live Demo

Frontend (Static Site): https://gvcc-learning-portal-development-front.onrender.com
Backend (Web Service): https://gvcc-learning-portal-development.onrender.com

✨ Features

🖥️ Premium User Experience
Dual UI Architecture: A cinematic dark-themed Landing Page for first impressions and a clean, light-themed Dashboard for distraction-free learning.
Interactive Sidebar Drawer: Navigate effortlessly between Dashboard, All Videos, and Profile.
Global Search & Filter: Instantly find lessons by topic or keyword.

🎥 Smart Learning Tools

Time-stamped Bookmarks: Save specific video moments with custom notes/titles.
Persistent Bookmarks Panel: Access all your saved moments via a slide-out drawer on the right side of the screen.
Continue Watching: Auto-saves your video playback progress to the exact second.
Progress Indicator: Visual tracking bars on video cards showing completion percentage.

🛡️ Professional Security

JWT Authentication: Secure login/register flow using JSON Web Tokens.
Content Protection: The video player automatically blurs if the user switches browser tabs or minimizes the window to prevent unauthorized screen capture.
CORS Management: Strict origin controls for production security.

🛠️ Tech Stack

Frontend
React 19 (Vite): Ultra-fast development and build performance.
Redux Toolkit: Centralized state management for Auth and Video data.
Tailwind CSS: Utility-first styling for a completely responsive UI.
Lucide React: Beautiful, consistent iconography.
React Player: Robust cross-platform video handling.
Backend
Node.js & Express: Scalable API architecture.
MongoDB Atlas: Cloud-based NoSQL database.
Mongoose: Object Data Modeling (ODM).
Bcrypt.js: Advanced password hashing for student privacy.

📂 Project Structure

code
Text
GVCC-Learning-Portal/

├── Backend/ 

│   ├── config/

│   ├── controllers/ 

│   ├── models/ 

│   ├── routes/ 

│   └── index.js 


└── Frontend/ 

    ├── public/  
  
    └── src/
    
        ├── components/
       
        ├── pages/ 
        # Landing, Dashboard, VideoDetail
        ├── services/
        # Axios API interceptors
        └── features/ 
        # Redux Slices (Auth/Videos)

Architecture Flow

    <img width="592" height="607" alt="image" src="https://github.com/user-attachments/assets/1900c0ef-9fee-48b6-9fde-116837a5214e" />


        

⚙️ Setup & Installation

1. Clone the repository
code
Bash
git clone https://github.com/lakshmi863/GVCC-Learning-Portal-Development.git
cd GVCC-Learning-Portal-Development
2. Backend Config
code
Bash
cd Backend
npm install
Create a .env file in /Backend:
code
Env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
3. Frontend Config
code
Bash
cd Frontend
npm install
Create a .env file in /Frontend:
code
Env
VITE_API_URL=http://localhost:5000/api

🌐 Deployment on Render

Backend (Web Service)
Build Command: npm install
Start Command: node index.js
Environment Variables: Add MONGO_URI, JWT_SECRET, and PORT.
Frontend (Static Site)
Build Command: npm install && npm run build
Publish Directory: dist
Environment Variables: Add VITE_API_URL (points to your Render backend).
Rewrite Rules: Set /* to /index.html (Action: Rewrite).

👤 Author

Lakshmi Pathi
Full Stack Developer
