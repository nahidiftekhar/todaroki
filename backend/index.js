const express = require('express');
const cors = require('cors');

const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');
const fileupload = require('express-fileupload');

const { config } = require('./configs/config');
const { apiKeyMiddleware } = require('./middleware/apiKey');

// CORS policy configuration
const corsOptions = {
  origin: config.WHITELISTED_DOMAINS,
  credentials: true,
};
app.use(cors(corsOptions));

// body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cookie-parser
app.use(cookieParser());

app.use(fileupload());

// Returns a middleware to serve favicon
app.use(favicon(`${__dirname}/favicon.png`));
// Pass the global passport object into the configuration function
require('./configs/passport')(passport);
// This will initialize the passport object on every request
app.use(passport.initialize());

// Set template engine
// app.engine('handlebars', engine());
const hbs = exphbs.create({
  helpers: {
    // eslint-disable-next-line func-names, object-shorthand
    eq: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    // eslint-disable-next-line func-names, object-shorthand
    neq: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.inverse(this) : options.fn(this);
    },
  },
  defaultLayout: 'main',
  partialsDir: ['views/partials/'],
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Route definitions
// eslint-disable-next-line prefer-arrow-callback
app.get('/', function (req, res) {
  res.send({ status: 'todaroki backend running' });
});

// Serve static images
app.use('/static', express.static('public'));

// Custom error handling middleware
app.use((err, req, res, next) => {
  if (err) {
    // Handle the error in the desired way
    console.error(err);
    res.status(404).send('Image not found');
  } else {
    // Proceed to the next middleware or route handler
    next();
  }
});

// Upload image file
app.post('/upload', (req, res) => {
  const newpath = `${__dirname}/public`;
  const { file } = req.files;
  const filename = req.body.fileName;
  const saveLocation = req.body.saveLocation;

  file.mv(`${newpath}/${saveLocation}/${filename}`, (err) => {
    if (err) {
      console.log(`err: ${err}`);
      res.status(500).send({ message: 'File upload failed', code: 200 });
    }
    res.status(200).send({ message: 'File Uploaded', code: 200 });
  });
});

app.use(apiKeyMiddleware);
// Imports all of the routes from ./routes/index.js
app.use(require('./controllers'));

// Start the server in port defined in config
const server = app.listen(process.env.PORT || config.PORT, function () {
  const port = server.address().port;
  console.log('App started with nodemon at port:', port);
});
