var express = require('express');

var app = express();

app.set('views', __dirname);
app.use('/lib',express.static(__dirname + '/lib'));
app.use(express.static(__dirname + '/view'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/images',express.static(__dirname + '/images'));

app.get('/', function(req, res){
  res.sendFile('/merryCard.html');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('app listen on port' + port);
});