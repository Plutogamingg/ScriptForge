# ScriptForge

React-Django Web Application
This README provides instructions for setting up and running a React-Django web application on your local machine. Follow the steps below to get the backend and frontend servers running.

Prerequisites
Make sure you have the following installed on your system:

Python 3.9
pip (Python package installer)
Node.js
npm (Node package manager)

Backend Setup

Navigate to the Backend Directory: cd backend

Install Backend Dependencies: pip install -r requirements.txt

Make Migrations: python manage.py makemigrations

Apply Migrations: python manage.py migrate

Run the Django Development Server:python manage.py runserver

The backend server should now be running at http://127.0.0.1:8000/.

Frontend Setup

Open a New Terminal:

Navigate to the Frontend Directory: cd frontend

Install Frontend Dependencies: npm install

Start the Frontend Development Server: npm run start

The frontend server should now be running at http://localhost:3000/.

Accessing the Application
Once both servers are running, open your web browser and go to http://localhost:3000/. The React application should load, and it will interact with the Django backend to provide a fully functional web app.

Troubleshooting

Backend Issues:
Ensure that your virtual environment is activated if you are using one.
Check for any errors in the terminal where the Django server is running.
Verify that the database migrations have been applied correctly.

Frontend Issues:
Ensure all dependencies are installed without errors.
Check for any errors in the terminal where the React server is running.
Make sure there are no conflicting processes using the same port (3000).

Additional Notes
Ensure that the backend server is running before starting the frontend server to avoid API call errors.
You can customize the configuration files as needed, such as settings.py for Django and .env or package.json for React.
By following these instructions, you should be able to set up and run the React-Django web application on your local machine. If you encounter any issues, refer to the troubleshooting section or consult the documentation for Django and React.