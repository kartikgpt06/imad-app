var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool= require('pg').Pool;

var config = {
    user: 'kartikgpt06',
    database: 'kartikgpt06',
    host: 'db.imad.hasura-app.io',
    port:'5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));


var articles= {
   'Article-one':{
    
    title:'Article One |Kartik Gupta',
    heading:'Article One',
    date:'Aug 16,2017',
    content: ` <p>
        This is the content for my first article.This is the content for my first article.
    </p>
    <p>
        This is the content for my first article.This is the content for my first article.
    </p>
    <p>
        This is the content for my first article.This is the content for my first article.
    </p>`

},
    'Article-Two':{
        
    title:'Article Two |Kartik Gupta',
    heading:'Article Two',
    date:'Aug 17,2017',
    content: ` <p>
        This is the content for my second article.This is the content for my second article.
    </p>
    
    <p>
        This is the content for my second article.This is the content for my second article.
    </p>`

        
    },
    'Article-Three':{
        
    title:'Article Three |Kartik Gupta',
    heading:'Article Three',
    date:'Aug 18 ,2017',
    content: ` <p>
        This is the content for my third article.This is the content for my third   article.
    </p>
    
    <p>
        This is the content for my third article.This is the content for my third article.
    </p>`
}
};
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
    ${date}
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

var pool = new Pool(config);
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

app.get('/:articleName',function(req,res){
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    var articleName=req.params.articleName;
    res.send(createTemplate(articles[articleName]));
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
