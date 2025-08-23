# You-Gram 📸

A modern, full-featured social media application built with the MERN stack, featuring real-time interactions, secure authentication, and seamless image sharing capabilities.

#### Video Demo:  https://youtu.be/nL_tDohbuT4?si=rvvtQY862JR7S68l 

## 🚀 Features

### Core Functionality

- **User Authentication & Authorization**: Secure JWT-based authentication system
- **Post Creation & Sharing**: Share photos and thoughts with your network
- **Real-time Feed**: Dynamic content feeds powered by MongoDB aggregation pipelines
- **Social Interactions**: Like, comment, and share posts
- **User Profiles**: Customizable user profiles with bio and profile pictures
- **Follow System**: Follow/unfollow users to curate your feed
- **Image Upload**: Seamless image uploads with Cloudinary integration

### Technical Highlights

- **RESTful API Design**: Well-structured API endpoints following REST principles
- **Cloud Storage**: Images stored and optimized via Cloudinary
- **Database Optimization**: MongoDB aggregation pipelines for efficient data retrieval
- **File Handling**: Multer middleware for handling multipart/form-data
- **Responsive Design**: Mobile-first, responsive user interface
- **Security**: Protected routes and secure password hashing

## 🛠️ Tech Stack

### Frontend

- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security

- **JWT (JSON Web Tokens)** - Secure authentication
- **bcrypt** - Password hashing
- **express-validator** - Input validation and sanitization

### File Upload & Storage

- **Multer** - Multipart form data handling
- **Cloudinary** - Cloud-based image storage and optimization

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account for image storage

### 1. Clone the Repository

```bash
git clone https://github.com/IfBilal/You-Gram.git
cd You-Gram
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

### 5. Run the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend application (from frontend directory)
npm run dev


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Bilal** - [@IfBilal](https://github.com/IfBilal)

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB team for powerful aggregation pipelines
- Cloudinary for reliable image hosting

## 🎓 CS50 Final Project

This project was created as part of Harvard's **CS50x Final Project**.
---

⭐ If you found this project helpful, please give it a star!

![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)
![MERN Stack](https://img.shields.io/badge/Built%20with-MERN%20Stack-green.svg)
![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-blue.svg)
```
