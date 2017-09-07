var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool= require('pg').Pool;
var crypto = require("crypto");
var bodyParser = require('body-parser');

var config = {
    user: 'kartikgpt06',
    database: 'kartikgpt06',
    host: 'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

function createTemplate (data) {
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
var htmlTemplate= `

<!DOCTYPE html>
<head>
    <title>
    
        ${title}
    </title>
    <meta name="viewport" content="width=device=width, initial-scale=1"/>
    <link href="/ui/style.css" rel="stylesheet" />
</head> 
<body>
<div class="container">
    <div>
        <c href="/">Home</c>
</div>
<hr/>
<h3>
    ${heading}
</h3>
<div>
    ${date.toDateString()}
</div>
<div>
 ${content}
</div>
</div>
</body>

</html>

`;
return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
    //How do we create a hash ?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
    
    //algorith: md5
    // 'password' -> dhfhdjfjdjjwie43ufjsdfj39dfsdjf2q9ensdfk2;
    //'password' - this-is-some-random-string" -> sdjfhjhsdfgheurhfkjsdfjksdfjk
    // 'password' -> 'password-this-is-a-salt' -> <hash> -> <hash> x 10x times.
}

app.get("/hash/:input", function(req,res) {
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user', function (req,res) {
   //username,password
   //{"username": "kartik" , "password": "password"}
   //JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)',[username, dbstring], function(err,result) {
          if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send('User successfully created: ' + username);
        }
       
   });
});

var Pool = new Pool(config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a response with the results
    pool.query('SELECT * FROM test',function(err,result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result.rows));
        }
    });    
});


var counter=0;
app.get('/counter', function(req,res) {
    counter = counter +1;
    res.send(counter.toString());
});

var names =[];
app.get('/submit-name', function(req,res) { //URL: /submit-name?name=XXXX 
    //Get the name from the request
    var name = req.query.name; 
    
    names.push(name);
    // JSON: Javascript Object Notation
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName',function(req,res){
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    
    //SELECT * FROM article WHERE title = '\';DELETE WHERE a= \'asdf'
    pool.query("SELECT * FROM article WHERE title= $1" , [req.params.articleName] ,function(err,result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});



var port = 80;
app.listen(80, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
