var express = require('express');

var app = express();

app.set('views', __dirname);
app.use('/lib',express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/view'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/images',express.static(__dirname + '/images'));

app.get('/', function(req, res){
  res.sendFile('/index.html');
});

app.listen(3000,function(){
	console.log('app listen on port 3000');
});