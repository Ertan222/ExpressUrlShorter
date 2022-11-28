require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlArr = [];
let key = 1;


app.route("/api/shorturl/:id?")
.post((req,res,next) => {
  let {url: userUrl} = req.body;

  const urlRegex = /(https:\/\/|http:\/\/)www\.(\w+)\.(com|org|io)/

  let regexResult = urlRegex.test(userUrl);


  if(regexResult) {
  let result = urlArr.find(elem => elem.long_url == userUrl);
  
  if(result === undefined) {
    urlArr.push({
      long_url: userUrl,
      short_url: key
    });
    key++;
    res.json({
      long_url: userUrl,
      short_url: key -1 
    });
  }

  res.json({
    long_url: `${result.long_url}`,
    short_url: `${result.short_url}`
  });
  }
  res.json({
    error: "Invalid url"
  });

  next();
})
.get((req,res) => {
  
  let redirectURL = urlArr.find(elem => elem.short_url == req.params.id);

  res.redirect(redirectURL.long_url);
});





app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
