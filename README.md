#  Online Movie Streaming Platform

An end-to-end **Movie Streaming Web Application** built with the MERN stack and cloud services. The platform allows users to:

- Register/Login securely using **JWT authentication**
- Subscribe via **Razorpay** to access streaming services
- Stream movies hosted in **cloud storage** (e.g., GCP)
- View movie posters, metadata, and trailers
- Access protected routes post-login and subscription

---

## Project Highlights

-  **Secure Authentication** using JWT tokens (stored in HTTP-only cookies or localStorage)
-  **Subscription System** using Razorpay payment gateway
-  **Cloud Integration** for storing and retrieving movie media
-  **MongoDB** stores all user and movie metadata
-  **Separation of concerns** with clearly divided frontend and backend
-  **Scalable Architecture** for streaming and metadata management

---

##  Tech Stack

| Layer          | Technologies Used                                                                 |
|----------------|------------------------------------------------------------------------------------|
| Frontend       | HTML, CSS, JavaScript, Bootstrap CSS               |
| Backend        | Node.js, Express.js, Mongoose, JWT, bcryptjs, dotenv                              |
| Database       | MongoDB Compass                                                             |
| Payments       | Razorpay API                                                                      |
| Cloud Storage  | GCP for storing videos and poster images                          |
| Authentication | JWT (JSON Web Tokens)                                                             |

---
