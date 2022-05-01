# ECOMMERCE - MERN
![ecommerce](/frontend/src/images/logo.png)
## Demo
This application will be deployed on Heroku soon. You can check it out :smile: [here]().<br>
<br>
This is a FULL Stack Ecommerce website which includes all the features that a Ecommerce website will usually have. It comes with a Admin Dashboard and Enabled Payment using Stripe.

1. Buyers browse the store categories, products and brands.
2. Buyers can filter price, rating, categories for more confined search.
3. Admins manage and control the entire store components.

* features:
  * Node provides the backend environment for this application
  * Express middleware is used to handle requests, routes, isAuthenticatedUser
  * Mongoose schemas to model the application data
  * React for displaying UI components
  * Redux to manage application's state
  * Redux Thunk middleware to handle asynchronous redux actions

## Install
Some basic git commands are:
```git
$ git clone https://github.com/AnantDuhan/MERN-Ecommerce.git
$ cd MERN-Ecommerce
$ npm install
```
**For Backend** - `npm install`
**For Frontend** - `cd frontend` `npm install`


## Env Variables

Make Sure to Create a config.env file in backend/config directory that include:

* DB_URI & JWT_SECRET_KEY & JWT_EXPIRES_IN
* PORT, FRONTEND_URL & RESULT_PER_PAGE 
* STRIPE_API_KEY & STRIPE_SECRET_KEY
* COOKIE_EXPIRES
* SMTP_HOST, SMTP_PORT & SMTP_SERVICE
* SMTP_MAIL & SMTP_PASSWORD
* CLOUDINARY_NAME
* CLOUDINARY_API_KEY & CLOUDINARY_API_SECRET


## Heroku Deployment

```
> Create a Procfile in the root directory of your application with the following command **web: npm run start:production**
```


## Simple build for production

```
$ npm run production
```

## Run the application for development

**for frontend**
```
$ npm start
```

**for backend**
```
$ npm run dev
```

## Run the application for production

```
$ npm run start:production
```

## Languages & tools

- [Mongoose](https://mongoosejs.com/)

- [Express](https://expressjs.com/)

- [React](https://reactjs.org/)

- [Node](https://nodejs.org/en/)

- [Webpack](https://webpack.js.org/)

- [Cloudinary](https://cloudinary.com/)

### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json
    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }
```

