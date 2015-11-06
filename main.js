var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS queue for image uploads
var images = [];

/////////////////////////////////////////////////////////////////
// 2. REDIS
var client = redis.createClient(6379, '127.0.0.1', {});
client.set("1", "Redis Client Value set.");
client.get("1", function(err,value){ console.log(value)});
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// 4. RECENT VISITED SITES
// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);

	// ... INSERT HERE.
	client.lpush(['recent-list', req.url], function(err, value) {})
  	client.ltrim('recent-list', 0, 4, function(err, value) {})
	
	next(); // Passing the request to the next handler in the stack.
});
/////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////
// 3. EXPIRING CACHE
///////////// WEB ROUTES
// Sets Key-value pair which expires in sometime
app.get('/set', function(req, res) {
  // set key-value pair which expires in 10 seconds
	client.set("2", "This message will self-destruct in 10 seconds!");
	client.expire("2", 10);
	res.send("Value set."+'<br><i>[Request served at '+process.argv[2]+']</i></br>');
})

// Gets the key-value pair
app.get('/get', function(req, res) {
	// gets the value
	client.get("2", function(err,value){ 
		if(value)
		{
			console.log("Value exists:", value);
			res.send("Value exists : "+value+'<br><i>[Request served at '+process.argv[2]+']</i></br>');
		}
			
		else
		{
			console.log("Value expired.");
			res.send("Value expired."+'<br><i>[Request served at '+process.argv[2]+']</i></br>');
		}	
		res.end();
	});
})
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// 4. RECENT VISITED SITES - CONTD.
// Add hook to make it easier to get all visited URLS.


// recent gets the top 5 websites visited
app.get('/recent',function(req, res) {
  		
  		client.lrange('recent-list', 0, 4, function(err, reply) {
    		console.log(reply); //prints 2
    		res.writeHead(200, {'content-type':'text/html'});
    		res.write("<h1>"+reply+"</h1><br><i>[Request served at "+process.argv[2]+"]</i></br>");
    	})
})
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// 5. CAT PICTURE UPLOADS - QUEUE
// Image Upload and Retrieve
 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    //console.log(req.body) // form fields
    //console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		//console.log(img);
 	  		client.rpush(['images', img], function(err, value) {});
 		});
 	}
    res.status(204).end();
 }]);


 app.get('/meow', function(req, res) {
 	client.lpop('images', function(err, imagedata){

 		if (err) throw err;
 		res.writeHead(200, {'content-type':'text/html'});
    	res.write("<h1>\n<img src='data:"+imagedata+".jpg;base64,"+imagedata+"'/></h1><br><i>[Request served at "+process.argv[2]+"]</i></br>");
    	//res.send('Request served at '+process.argv[2]+'.');
    	res.end();
 	});
 })
/////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// 1. SIMPLE HTTP WEB SERVER
var server = app.listen(process.argv[2], function () {

   var host = server.address().address;
   var port = server.address().port;

   console.log('Example app listening at http://%s:%s', host, port);
 })

// sample response
app.get('/', function(req, res) {
  res.send('Hello Ravina!'+'<br><i>[Request served at '+process.argv[2]+']</i></br>');
})
/////////////////////////////////////////////////////////////////
