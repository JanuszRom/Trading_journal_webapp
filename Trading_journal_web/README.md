# Trading Journal Web

This README file contains documentation specific to the Trading Journal Web backend.

## Overview

The Trading Journal Web is a backend application designed to manage and track trading activities. It provides APIs for creating, retrieving, and managing trades, as well as handling file uploads for trade-related screenshots.

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd trading-journal-project/Trading_journal_web
   ```

2. **Install Dependencies**
   Ensure you have Python and pip installed. Then, install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. **Configure the Application**
   Set up your environment variables or configuration files as needed. Ensure to specify the database connection and upload folder.

4. **Run the Application**
   Start the Flask application:
   ```
   flask run
   ```

## Usage

- The API endpoints are available at `/api/trades`.
- Use POST requests to create new trades and GET requests to retrieve existing trades.

## Additional Information

- Ensure that the database is properly set up and migrated before running the application.
- Refer to the frontend documentation for details on how to connect the frontend application to this backend service.