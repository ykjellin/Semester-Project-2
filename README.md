# Elegant auctions (Semester-Project-2)

---

![Screenshot](https://private-user-images.githubusercontent.com/127968935/420698833-039cd26d-ae5a-4d42-8a2e-dec3b189b0d5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDE1NDkzMzMsIm5iZiI6MTc0MTU0OTAzMywicGF0aCI6Ii8xMjc5Njg5MzUvNDIwNjk4ODMzLTAzOWNkMjZkLWFlNWEtNGQ0Mi04YTJlLWRlYzNiMTg5YjBkNS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMzA5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDMwOVQxOTM3MTNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xYmE0NmIxNTk5NDRhZjhlMzRjYmYxM2RkMjY3NzM4ODY1ZTc4MDE1NzNhY2Q0YjNiYTdkY2FiZmM1YTZlMGY5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9._ixkn3a9HjC4REiaIRGq_0XC0q1URKvWB7tqun04N2Y)

## Description

This project is an auction website built using Bootstrap 5 and SASS. It provides a platform for users to list items for auction, place bids, and manage their accounts. The website features a responsive design with a gold and dark color scheme, offering a luxurious feel to the auction experience.

---

## Features

- User registration and authentication
- Listing creation for auction items
- Bidding functionality
- User profiles with avatars and banners
- Responsive design for mobile and desktop viewing
- Search functionality for auction items
- Contact form for user inquiries

---

## Technologies Used

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/bootstrap_5-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which comes with [npm](http://npmjs.com/))
- A modern web browser

---

## Setup and Installation

1. Clone the repository:

   ```
   git clone https://github.com/ykjellin/Semester-Project-2.git
   ```

2. Navigate to the project directory:

   ```
   cd auction-website
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Compile the SASS files:

   ```
   npm run sass
   ```

---

## Running the Project

To run the project with live reloading of SASS changes:

1. Start the SASS watch process:

   ```
   npm run sass:watch
   ```

2. Use a local server to serve the project. You can use something like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for Visual Studio Code, or install it with npm

   ```
   npm install -g live-server
   ```

3. Then run the following command:

   ```
   live-server
   ```

4. Your default browser will open and display your project, automatically reloading when you save changes to your files.

---

## Special Instructions for Testers

When testing this project, please pay attention to the following areas:

1. Responsive Design: Test the website on various device sizes to ensure the layout adjusts correctly.

2. Cross-browser Compatibility: Verify that all features work consistently across different browsers (Chrome, Firefox, Safari, Edge).

3. Form Validation: Test all forms (registration, login, create auction, bidding) with both valid and invalid inputs.

4. User Flow: Go through the entire user journey from registration to creating an auction and placing bids.

5. Search Functionality: Test the search feature with titles to ensure it returns results.

6. Performance: Pay attention to load times and any potential performance issues.

7. Accessibility: Check that the website is navigable using only a keyboard and that all images have appropriate alt text.

---

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.
