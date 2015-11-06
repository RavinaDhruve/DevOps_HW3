var http      = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');
var express = require('express');
var app = express();

var client = redis.createClient(6379, '127.0.0.1', {});

console.log("PROXY SERVER LISTENING ON 8080.....");

client.del('nodes');


// n is the number of servers serving the requests. Here, n is 2.
var n = 2;
for(var i=0; i<n ; i++) {
  var port_num = 3000+i;
  var TARGET = 'http://127.0.0.1:'+port_num;

   client.lpush(['nodes',TARGET], function(err, value) {
    //console.log("VALUE : ", value);
  })
}



// Proxy
var options = {};
var proxy   = httpProxy.createProxyServer(options);


var server  = http.createServer(function(req, res) {

  client.rpoplpush('nodes', 'nodes', function(err, server_node) {
    proxy.web(req, res, {target: server_node});
    console.log("Request redirected to Server: ", server_node);
  })

});
server.listen(8080);