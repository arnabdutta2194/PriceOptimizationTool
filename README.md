##  Price Optimization Tool

The Price Optimization Tool is a web-based application designed to help businesses optimize their pricing strategy by analyzing product data, demand forecasts, and market conditions. The tool offers a multi-functional interface with the following key features:

## Product Management:
Allows users to create, view, update, and delete product information including details like name, category, cost, selling price, stock, and sales based on their roles.\
Provides advanced search and filtering capabilities to efficiently find and organize products.\
Demand Forecast Integration:\
Users can view demand forecasts for various products, displayed in a linear graph showing the relationship between demand and selling price.
## Pricing Optimization:
Recommends optimal prices for products based on demand, cost, and market conditions, helping businesses maximize profitability.\
User Roles and Permissions:\
Implements dynamic user roles and permissions to ensure flexible access control, supporting various user types like admins, buyers, and suppliers.\
The tool is built using Python with Django Rest Framework for backend development and React.js for the frontend, ensuring scalability and responsiveness. Data is stored in a relational database (PostgreSQL) with efficient indexing for performance.

## User Roles and Permissions
The Price Optimization Tool incorporates dynamic user roles with different levels of access to ensure that each user type can perform the necessary tasks. The three primary user roles are Admin, Supplier, and Buyer, each with varying degrees of permissions:
### Admin:
Product Management: Can view, add, update, and delete product information.\
Demand Forecast: Can view demand forecasts for all products.\
Pricing Optimization: Can access and view optimized pricing recommendations for all products.
### Supplier:
Product Management: Can view, add, update, and delete product information.\
Demand Forecast: Can view demand forecasts for products they are associated with.\
Pricing Optimization: Can access and view optimized pricing recommendations for their products.
### Buyer:
Product Management: Can only view product information (no permissions to add, update, or delete).\
Demand Forecast: Can view demand forecasts for the products.\
Pricing Optimization: Can view optimized pricing recommendations, but cannot modify or manage them.


## Features : 

#### User Management
#### Register users with roles (Admin, Supplier, Buyer).
#### Login and logout using JWT tokens.
#### Email-based account activation.
#### Product Management
#### Create, retrieve, update, and delete products.
#### Search and filter products by name, category, and other attributes.
#### Supports automatic demand forecasting and pricing optimization.
### Pricing Optimization
#### Automatically updates demand forecast and optimized prices when products are created or updated.
#### Provides APIs to fetch demand forecasts and optimized prices for products.

## Prerequisites : 
Python: Version 3.8 or higher\
PostgreSQL: Database for storing application data\
pip: Python package manager


## Setup Instructions for Backend Codebase : 
1) Install Python and Virtual Environment : 
Ensure Python is installed on your system:

### `python --version`

2) Create a virtual environment:

### `python -m venv venv`
### `source venv/bin/activate`  # On Windows: venv\Scripts\activate

3) Install Dependencies :
Install the required packages using pip:

### `pip install -r requirements.txt`

4) Configure the Database :
Ensure PostgreSQL is running and create a database for the project:

### `CREATE DATABASE pricing_application_db`;

5) Update settings.py with the Database Server Username and Password :

 `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # PostgreSQL database engine
        'NAME': 'pricing_application_db',  # Database name
        'USER':   # Database user
        'PASSWORD':   # Database password
        'HOST': 'localhost',  # Database host (local server)
        'PORT': '5432',  # PostgreSQL default port
    }`

6) Create a New Application password for your gmail account and update your email id and password below in the settings.py file, you can also use any custom smtp server :

`EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'  # Use SMTP for email sending
EMAIL_HOST = 'smtp.gmail.com'  # Gmail SMTP server
EMAIL_PORT = 587  # Gmail SMTP port
EMAIL_USE_TLS = True  # Use TLS encryption for email
EMAIL_HOST_USER = {add username here}  # Gmail email address
EMAIL_HOST_PASSWORD = {add password here} # Gmail email password (should be kept secret in production)`

7) Apply Migrations
Run the migrations to set up the database schema:

### `python manage.py makemigrations`
### `python manage.py migrate`

8) Create a Superuser
Create an admin user for accessing the Django admin interface:

### `python manage.py createsuperuser`

9) Run the Server
Start the Django development server:

### `python manage.py runserver`

Access the application at http://127.0.0.1:8000

## Setup Instruction for Frontend Codebase : 

1) Install Node.js : 

Download and install Node.js from the official website: https://nodejs.org/en.

2) Verify Installation : 

Open a terminal and check the installed versions of Node.js and npm by running the following commands:

### `node -v`
### `npm -v`

This will display the installed versions of Node.js and npm to confirm they were installed correctly.
Prepare the Project

3) Download the  zip folder : 
Extract the contents of the zip file to a desired location.

4) Install Dependencies : 

Navigate to the extracted project folder in the terminal and run the following command to install the necessary dependencies:

### `npm install`

5) Run the Application

Start the server by running:

### `npm start`

### This will launch the React application, usually on http://localhost:3000 or http://127.0.0.1:3000/, unless specified otherwise.


### Backend Folder Structure
price_optimization_tool/ \
├── accounts/         # User management app \
├── products/         # Product management app \
├── pricing/          # Pricing optimization app \
├── templates/        # Email templates  
├── price_optimization_tool/ # Project configuration \
├── manage.py         # Django entry point \
└── requirements.txt  # Dependencies 

### Frontend Folder Structure :
src/ \
    App.css \
    App.js \
    App.test.js \
    config.json \
    CustomNotification.js \
    index.css \
    index.js \ 
    PrivateRoute.js \
    Auth/ \
        ---axiosSetup.js \
        ---LoginScreen.css \
        ---LoginScreen.js \
    components/ \
        ---Footer.js \
        ---Navbar.js \
        ---ProductDialog.js \
        ---ProductNavBar.js \
    pages/ \
        ---CreateAndManageProduct.js \
        ---Dashboard.js \
        ---DemandForecast.js \ 
        ---DemandForecastChart.js \
        ---PricingOptimization.js \
    store/ \
        ---NotificationStore.js \
        ---ProductStore.js \
        ---SessionStore.js 


### API Usage

### Authentication
#### Register: /accounts/register/ (POST) \
Register a new user. The user will receive an email for account activation. \
Request Body: 

`{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword",
  "role": "buyer"
}`


##### Login: /accounts/login/ (POST)
Authenticate a user and return JWT tokens. \
Request Body: 

`{
  "email": "test@example.com", 
  "password": "securepassword"
}`

#### Logout: /accounts/logout/ (POST)
Blacklist the user's refresh token. \
Request Body:

`{
  "refresh": "your_refresh_token"
}`

#### Verify Email: /accounts/verify-email/uidb64/token/ (GET)
Activate a user's account by clicking the link sent to their email. 


### Product Management
#### List/Create Products: /products/ (GET, POST)

GET: Fetch all products (search and filter supported via query parameters). \
POST: Create a new product (Admins and Suppliers only). \
Request Body for POST:

`{
  "name": "Product A",
  "category": "Electronics",
  "cost_price": 100.00,
  "selling_price": 120.00,
  "description": "A high-quality product",
  "stock_available": 50,
  "units_sold": 10
}`


#### Retrieve/Update/Delete Products: /products/<id>/ (GET, PUT, DELETE)

GET: Retrieve details of a specific product. \
PUT: Update product details (Admins and Suppliers only). \
DELETE: Delete a product (Admins and Suppliers only).

### Pricing Optimization
#### Get Demand Forecast: /pricing/demand-forecast/ (POST)
Fetch demand forecasts for multiple products by providing their IDs.\
Request Body:

`{
  "ids": [1, 2, 3]
}`

#### Get Pricing Optimization Data: /pricing/pricing-optimization/ (GET)
#### Fetch pricing optimization details for all products, including optimized prices.
