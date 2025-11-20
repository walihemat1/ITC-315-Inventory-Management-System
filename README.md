# Inventory Management System

The Inventory Management System (IMS) is a web-based application designed to help small businesses or organizations efficiently manage their product inventory.  
It allows users to add, edit, and delete products, record stock-in and stock-out operations, track current stock levels, and get alerts when items are running low.  
The system also provides a dashboard with key inventory statistics and simple reports, enabling managers to make informed decisions about ordering and stock management.  
This project was developed as a Software Engineering final project using the Scrum methodology to practice agile development, teamwork, and good software engineering practices.

## 📘 Overview

The Inventory Management System (IMS) is designed for small businesses to track and manage their products, stock levels, and inventory activities.  
It helps ensure that the business always knows what items are available, when to restock, and prevents stock-outs.

## Main Features

- **Product Management**

  - Add, edit, delete, and categorize products
  - Search products by name or SKU
  - Upload product images

- **Stock Management**

  - Record stock-in and stock-out
  - View current stock levels
  - Low-stock alerts

- **User Authentication**

  - Admin and Staff roles
  - Login and logout

- **Dashboard**

  - Total products
  - Stock-in and stock-out overview
  - Low-stock items highlighted

- **Reporting**
  - Low-stock report
  - Stock movement report

## Technologies Used

**Frontend**

- React.js
- Tailwind CSS
- Axios
- React Router

**Backend**

- Node.js
- Express.js
- MongoDB / Mongoose

**Other Tools**

- Git & GitHub
- Scrum framework
- Figma (optional for UI design)

## Project Goals

- Apply Scrum methodology and work in sprints
- Gather requirements and write documentation
- Build a functional MERN-stack application
- Implement good coding and design practices
- Collaborate effectively as a team

## Project Structure

│
├── docs/
│ ├── README.md
│ ├── product-backlog.md
│ ├── user-stories.md
│ ├── srs.md
│ ├── sprint-plan.md
│ ├── sprint-backlog-sprint-1.md
│ ├── sprint-backlog-sprint-2.md
│ ├── architecture.md
│ ├── use-case-diagram.md
│ ├── er-diagram.md
│ └── class-diagram.md
│
├── frontend/ (React code)
├── backend/ (Node/Express code)
└── README.md

## Roles in the Project

- **Product Owner:** Manages the backlog and requirements
- **Scrum Master:** Facilitates Scrum ceremonies
- **Development Team:** Frontend & backend development
- **QA / Tester:** Tests features and verifies acceptance criteria

## How to Run the System

### Clone the repository

git clone https://github.com/your-username/inventory-management-system.git
cd inventory-management-system

### Backend Setup

cd backend
npm install
npm start

### Frontend Setup

cd frontend
npm install
npm run dev

### Environment Variables

MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-secret
PORT=5000

### Team Members

| Name             | Role          |
| ---------------- | ------------- |
| Hamid Sultani    | Product Owner |
| Zainab Qasemi    | Scrum Master  |
| Ahmad Wali Hemat | Develoer      |
| Ali Sina Nazari  | Develoer      |
| Alia Rafi        | Develoer      |

### License

This project is for educational purposes.
Free to use, modify, and learn from.
