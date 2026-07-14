require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('./models/Video');

const sampleVideos = [
  {
    title: "Introduction to React.js",
    description: "Learn the core concepts of React: Components, JSX, and Props in under 10 minutes.",
    videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    thumbnailUrl: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
    duration: "10:15"
  },
  {
    title: "Docker and Containerization",
    description: "Learn how to wrap your applications into containers to ensure they run everywhere.",
    videoUrl: "https://www.youtube.com/watch?v=pg19Z8LL06w",
    thumbnailUrl: "https://img.youtube.com/vi/pg19Z8LL06w/maxresdefault.jpg",
    duration: "14:22"
  },
  {
    title: "TypeScript Course",
    description: "Upgrade your JavaScript. Learn interfaces, types, and how to write bug-free code with TypeScript.",
    videoUrl: "https://www.youtube.com/watch?v=ahCwqrYpIuM",
    thumbnailUrl: "https://cdn.thenewstack.io/media/2022/01/10b88c68-typescript-logo-1024x576.png",
    duration: "12:00"
  },
  {
    title: "SQL vs NoSQL Databases",
    description: "Which one should you choose? Compare PostgreSQL (SQL) with MongoDB (NoSQL) for your next project.",
    videoUrl: "https://www.youtube.com/watch?v=_Ss42Vb1SU4",
    thumbnailUrl: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20191104165821/SQL-Vs-NoSQL1.png",
    duration: "04:15"
  },
  {
    title: "Next.js 14 Complete Guide",
    description: "Master Server Components, App Router, and server-side rendering in the most popular React framework.",
    videoUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
    thumbnailUrl: "https://img.youtube.com/vi/wm5gMKuwSYk/maxresdefault.jpg",
    duration: "20:05"
  },
  {
    title: "Git and GitHub for Beginners",
    description: "Learn version control from scratch: branching, merging, pull requests, and collaboration.",
    videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    thumbnailUrl: "https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg",
    duration: "09:50"
  },
  {
    title: "Building REST APIs with Express",
    description: "Standard practices for designing endpoints, handling status codes, and error management.",
    videoUrl: "https://www.youtube.com/watch?v=fgTGADljAeg",
    thumbnailUrl: "https://img.youtube.com/vi/fgTGADljAeg/maxresdefault.jpg",
    duration: "16:30"
  },
   {
    title: "Web Development & Coding",
    description: "Watch a developer build a modern web application from scratch using a code editor.",
    videoUrl: "https://www.youtube.com/watch?v=GxmfcnU3feo",
    thumbnailUrl: "https://img.magnific.com/free-photo/web-design-technology-browsing-programming-concept_53876-163260.jpg",
    duration: "00:13"
  }

];
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Video.deleteMany({});
    await Video.insertMany(sampleVideos);
        console.log("✅ Videos Added to Database!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();