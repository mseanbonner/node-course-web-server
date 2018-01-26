const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// middleware here - fires in sequence
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();  // must call or server hangs
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   console.log('Display maint mode - abort');
// });

app.use(express.static(__dirname + '/public'));

// hbs functs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// routes
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'This site is the greatest since sliced bread!'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  })
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'My Projects'
  })
});


app.get('/bad', (req, res) => {
  res.send({
    error: 12,
    errorMessage: 'oops, no can do'
  });
});

// start server loop
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
