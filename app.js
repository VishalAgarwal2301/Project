import express from 'express';
import bodyParser from 'body-parser';
import request from 'request-promise';
import { getData, putData } from './database.js';

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

// render
app.get('/login', async (req, res) => {
  res.render('login.ejs');
});

app.post('/login', async (req, res) => {
  try {
    const data = await getData();
    const { username, pass } = req.body;

    data.forEach(e => {
      if (username === e.username && pass === e.password) {
        res.render('main.ejs');
      }
    });
  } catch (error) {
    res.send('Failed');
  }
});

app.get('/register', async (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const { username, Email, pass } = req.body;

  // CAPTCHA verification
  const userResponse = req.body['g-recaptcha-response'];
  const secret = '6LdFS98oAAAAAHMxrA4lT79up7ZlzY8CXMJZZ9cu'; // Replace with your reCAPTCHA secret key

  const verifyOptions = {
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    method: 'POST',
    json: true,
    form: {
      secret,
      response: userResponse,
    },
  };

  try {
    const verifyResponse = await request(verifyOptions);
    if (!verifyResponse.success) {
      return res.send('CAPTCHA verification failed. Please try again.');
    }
  } catch (error) {
    return res.status(500).send('Error verifying CAPTCHA');
  }

  try {
    // CAPTCHA verification passed, continue with user registration
    const data = await putData(username, pass, Email);
    res.render('login.ejs');
  } catch {
    res.send('Failed');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
