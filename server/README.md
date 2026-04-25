# LearnInfinity — Backend API

MERN Stack SaaS Education Platform — Node.js + Express + MongoDB

## Project Structure

```
backend/
├── config/
│   ├── db.js               
│   ├── cloudinary.js       
│   └── razorpay.js         
├── controllers/
│   ├── authController.js
│   ├── contentController.js
│   ├── classroomController.js
│   ├── testController.js
│   ├── notesController.js
│   ├── communityController.js
│   ├── chatController.js
│   ├── subscriptionController.js
│   ├── notificationController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js   
│   ├── errorMiddleware.js  
│   └── uploadMiddleware.js 
├── models/
│   ├── User.js
│   ├── Institute.js
│   ├── Category.js
│   ├── Content.js
│   ├── Classroom.js
│   ├── Test.js
│   ├── Attempt.js
│   ├── Note.js
│   ├── Post.js
│   ├── Doubt.js
│   ├── Message.js
│   ├── Subscription.js
│   ├── Notification.js
│   └── Progress.js
├── routes/
│   ├── auth.js
│   ├── content.js
│   ├── classrooms.js
│   ├── tests.js
│   ├── notes.js
│   ├── community.js
│   ├── chat.js
│   ├── subscriptions.js
│   ├── notifications.js
│   └── admin.js
├── socket/
│   └── socketHandler.js    # All Socket.io events
├── utils/
│   ├── sendEmail.js        # Nodemailer helper
│   ├── notificationHelper.js
│   └── cronJobs.js         # Subscription expiry cron
├── db/
│   └── seed.js             # Database seeder
├── uploads/                
├── .env.example
├── .gitignore
├── package.json
└── server.js              
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your values in .env
```

### 3. Seed the database
```bash
node db/seed.js
```

### 4. Run in development
```bash
npm run dev
```

### 5. Run in production
```bash
npm start
```

## API Base URL
```
http://localhost:5000/api
```

