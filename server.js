var express = require('express');
var morgan = require('morgan');
var path = require('path');

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
var counter=0;
app.get('/counter', function(req,res) {
    counter= counter +1;
    res.send(counter.toString());
});

app.get('/:articleName',function(req,res){
    //articleName == article-one
    //articles[articleName] == {} content object for article one
    var articleName=req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var port = 80;
app.listen(80, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
