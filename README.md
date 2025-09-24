# StayLocator

StayLocator is a full-featured web application for listing, discovering, and reviewing rental stays, inspired by platforms like Airbnb. Built with Node.js, Express, MongoDB, and EJS, it allows users to sign up, log in, create listings, leave reviews, and manage their stays with a modern, user-friendly interface.

## Features

- **User Authentication:** Sign up, log in, and manage user accounts securely.
- **Listings Management:** Create, edit, view, and delete property listings with images and detailed descriptions.
- **Reviews:** Leave and manage reviews for listings, including ratings and comments.
- **Responsive UI:** Clean and responsive design using EJS templates and custom CSS.
- **Flash Messages:** User feedback for actions like login, signup, and CRUD operations.
- **Error Handling:** Robust error handling and custom error pages.
- **Modular Codebase:** Organized with MVC architecture, middleware, and utility helpers.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Templating:** EJS
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** Passport.js (if implemented)
- **Testing:** Jest (see `tests/` directory)
- **Utilities:** Multer (for file uploads), Cloudinary (for image hosting, see `cloudConfig.js`)

## Project Structure

```
StayLocator/
│
├── app.js                # Main Express app
├── cloudConfig.js        # Cloudinary configuration
├── middleware.js         # Custom middleware
├── schema.js             # Joi validation schemas
│
├── controllers/          # Route controllers
│   ├── listings.js
│   ├── review.js
│   └── user.js
│
├── models/               # Mongoose models
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/               # Express route definitions
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/                # EJS templates
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   └── users/
│
├── public/               # Static assets (CSS, JS)
│
├── utils/                # Utility functions
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── init/                 # Seed data and scripts
│
├── tests/                # Automated tests
│
├── .env                  # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- [Optional] npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/StayLocator.git
   cd StayLocator
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following (replace with your credentials):

   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   DB_URL=mongodb://localhost:27017/staylocator
   SECRET=your_session_secret
   ```

4. **Seed the database (optional):**
   ```sh
   node init/index.js
   ```

5. **Start the application:**
   ```sh
   npm start
   ```

   The app will run on [http://localhost:3000](http://localhost:3000) by default.

## Usage

- Visit `/` to see all listings.
- Sign up or log in to create, edit, or delete your own listings.
- Leave reviews on listings you have visited.
- Edit your profile and manage your stays.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
