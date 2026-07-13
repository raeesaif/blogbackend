# 📝 Blog Backend API

A fully-featured RESTful API for a blog platform built with Node.js, Express, and MongoDB. Supports authentication, blog management, image uploads, likes, favorites, and activity tracking.

## 🚀 Live Demo

```
https://blogbackend-4wwj.vercel.app/api/v1
```

---

## ✨ Features

- 🔐 JWT Authentication (Access Token)
- 👤 User Roles (Admin, Writer, Reader)
- 📝 Blog CRUD (Create, Read, Update, Delete)
- 🖼️ Image Upload via Cloudinary or External URL
- 📂 Blog Categories & Status (Draft / Published)
- 🔍 Search, Filter & Pagination
- ❤️ Like / Unlike Blogs
- ⭐ Favorite Blogs
- 👁️ Unique View Tracking (per logged-in user)
- ⏱️ Read Time Estimation
- 📊 Activity Tracking
- ✅ Request Validation with Zod
- 🛡️ Role-based Access Control

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js v5** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **Bcryptjs** | Password Hashing |
| **Cloudinary** | Image Storage |
| **Multer** | File Upload Handling |
| **Zod** | Schema Validation |
| **Dotenv** | Environment Variables |
| **Nodemon** | Development Server |
| **Vercel** | Deployment |

---

## 📁 Project Structure

```
BlogBackend/
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── blogController.js     # Blog logic
│   ├── likeController.js     # Like/Unlike logic
│   ├── favriteController.js  # Favorites logic
│   └── ActivityController.js # Activity tracking
├── middleware/
│   ├── authMiddleware.js     # JWT verification
│   ├── optionalAuth.js       # Optional JWT verification
│   ├── multer.js             # File upload & validation
│   ├── validate.js           # Zod validation
│   ├── logger.js             # Request logger
│   ├── error.js              # Error handler
│   └── notfound.js           # 404 handler
├── models/
│   ├── User.js               # User schema
│   ├── Blog.js               # Blog schema
│   ├── likeBlog.js           # Like schema
│   ├── favriteBlog.js        # Favorite schema
│   └── Activity.js           # Activity schema
├── routes/
│   ├── authrotes.js          # Auth routes
│   ├── blogrotes.js          # Blog routes
│   ├── likeroutes.js         # Like routes
│   ├── favriteroutes.js      # Favorite routes
│   └── activityRoutes.js     # Activity routes
├── schema/
│   ├── authSchema.js         # Auth validation schema
│   └── blogSchema.js         # Blog validation schema
├── db.js                     # MongoDB connection
├── server.js                 # Entry point
└── vercel.json               # Vercel config
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/raeesaif/blogbackend.git

# Navigate to project directory
cd blogbackend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5001
MONGO_CNN=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | ❌ |
| POST | `/api/v1/auth/login` | Login user | ❌ |
| GET | `/api/v1/auth/me` | Get current user | ✅ |
| PATCH | `/api/v1/auth/update-profile` | Update profile & image | ✅ |
| PATCH | `/api/v1/auth/update-password` | Update password | ✅ |

### 📝 Blogs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/create-blogs` | Create a blog | ✅ |
| GET | `/api/v1/blogs` | Get all published blogs | Optional |
| GET | `/api/v1/blog/:id` | Get single blog | Optional |
| PATCH | `/api/v1/update-blog/:id` | Update a blog | ✅ |
| DELETE | `/api/v1/delete-blog/:id` | Delete a blog | ✅ |
| GET | `/api/v1/my-blogs` | Get my blogs | ✅ |

### ❤️ Likes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/toggle-like/:blogId` | Like / Unlike a blog | ✅ |
| GET | `/api/v1/check-like/:blogId` | Check if liked | ✅ |
| GET | `/api/v1/get-likes/:blogId` | Get blog likes count | ✅ |

### ⭐ Favorites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/add-favrite` | Add to favorites | ❌ |
| GET | `/api/v1/favrite-blogs/:userId` | Get favorite blogs | ❌ |
| DELETE | `/api/v1/remove-favrite/:userId/:blogId` | Remove from favorites | ❌ |

### 📊 Activity

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/activities` | Get all activities | ✅ |

---

## 🔍 Query Parameters

### GET `/api/v1/blogs`

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Number | Page number | `?page=1` |
| `limit` | Number | Results per page | `?limit=10` |
| `category` | String | Filter by category | `?category=health` |
| `search` | String | Search by title or category | `?search=health` |
| `sortBy` | String | Sort results | `?sortBy=newest` |

**sortBy options:**
- `newest` - Blogs from last 7 days
- `most_liked` - Most liked blogs
- `shortest_read` - Shortest read time

---

## 🖼️ Image Upload

Supports two options for blog cover images:

**Option 1: Upload File**
- Send as `form-data` with `coverImage` as `File`
- Uploads to Cloudinary
- Returns Cloudinary URL and `coverImagePublicId`

**Option 2: Paste URL**
- Send as `form-data` with `coverImage` as `Text`
- Saves URL directly
- `coverImagePublicId` will be `null`

**Restrictions:**
- Allowed formats: `JPG`, `JPEG`, `PNG`
- Maximum size: `5MB`

---

## 👁️ View Tracking

- **Logged-in users:** View counted only once per user per blog
- **Anonymous users:** Blog is returned but view is not counted

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| `reader` | Read blogs, like, favorite |
| `writer` | Create, update, delete own blogs |
| `admin` | Full access including deleting any blog |

---

## 📦 Blog Categories

- `technology`
- `lifestyle`
- `travel`
- `health`
- `business`
- `education`

---

## 🔒 Validation

All requests are validated using **Zod** schemas:

- Title: min 5, max 100 characters
- Content: min 20 characters
- Category: must be one of the allowed categories
- Image: JPG/PNG only, max 5MB

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Raees Asif**
- GitHub: [@raeesaif](https://github.com/raeesaif)
