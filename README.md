# Task and Sub-task Backend Application

## Overview

This is a Node.js backend application for managing tasks and sub-tasks. The application includes APIs for creating, updating, and deleting tasks and sub-tasks, as well as cron jobs for handling task priorities and initiating voice calls using Twilio.

## Features

### Main APIs

1. **Create Task**
   - Endpoint: `/api/task/create`
   - Input: Title, description, due_date (with JWT authentication)

2. **Create Sub-task**
   - Endpoint: `/api/subtask/create`
   - Input: task_id

3. **Get All User Tasks**
   - Endpoint: `/api/user/tasks`
   - Filters: Priority, due date, pagination

4. **Get All User Sub-tasks**
   - Endpoint: `/api/user/subtasks`
   - Filters: Task_id (if passed)

5. **Update Task**
   - Endpoint: `/api/task/update`
   - Updates: Due date, status ("TODO" or "DONE")

6. **Update Sub-task**
   - Endpoint: `/api/subtask/update`
   - Updates: Status (0 or 1)

7. **Delete Task (Soft Deletion)**
   - Endpoint: `/api/task/delete`

8. **Delete Sub-task (Soft Deletion)**
   - Endpoint: `/api/subtask/delete`

### Cron Jobs

1. **Task Priority Update**
   - Cron Logic: Change priority of tasks based on due date
   - Priority:
     - 0: Due date is today
     - 1: Due date is between tomorrow and day after tomorrow
     - 2: 3-4 days from today
     - 3: 5 or more days from today

2. **Voice Calling**
   - Cron Logic: Initiate voice calls using Twilio for overdue tasks
   - Priority: Calls based on user priority (0, 1, 2)
   - Behavior: Call the next user only if the previous user does not answer the call

## Tech Stack

- **Node.js:** Backend server framework
- **Express:** Web application framework
- **MongoDB:** Database for storing task and user information
- **JWT:** JSON Web Token for authentication
- **Twilio:** External service for initiating voice calls

## Environment Variables

Ensure the following environment variables are set:

- `PORT`: Port for the server
- `MONGODB_URI`: MongoDB connection URI
- `JWT_SECRET`: Secret key for JWT token generation
- `TWILIO_ACCOUNT_SID`: Twilio account SID
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number for making calls

## Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   
2. Change into the project directory:
    ```bash
    cd task-and-subtask-backend-application
    ```

3. Switch to the master branch:
    ```bash
    git checkout main
    ```

4. Install dependencies:
    ```bash
    npm install
    ```

## Usage

- Run the backend:
    ```bash
    npm run start
    ```

## 🚀 About Me
Hey! This is Ayush Singh. I'm a backend developer and a Bitcoin core contributor from India. 

Most recently, I was chosen among 45 students from all over the world for the Summer of Bitcoin internship, where I was responsible for making open-source contributions to Bitcoin Core. I made 4 PRs to the original Bitcoin you must have heard about in the news, one of them is already merged and is in production. Along with that, I'm a backend developer who has worked on many full-stack applications related to Blockchain and Core CS technologies. I'm also a great problem solver as I do a lot of competitive programming, I'm a Specialist on Codeforces, an ICPC India regionalist, and a Knight on Leetcode.

Besides my technical knowledge and experience, I'm very interested in philosophy and I'm a self-driven person, I don't need external motivation to work hard, I'm a naturally hardworking being, who gets things done.
