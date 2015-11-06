# CSC 791 DevOps, Fall 2015

## Homework Assignment #3

**Name:** *Ravina Dhruve*
**Unity ID:** *rrdhruve*
___


Cache, Proxies, Queues
=========================

### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379

### TASK 1: A simple web server

Use [express](http://expressjs.com/) to install a simple web server.


### TASK 2: Redis

We are using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	
### TASK 3: An expiring cache

We are creating two routes, `/get` and `/set`.

When `/set` is visited, we are setting a new key, with the value:
> "this message will self-destruct in 10 seconds".

When `/get` is visited, we are fetching that key, and send value back to the client. 


### TASK 4: Recent visited sites

We are create a new route, `/recent`, which will display the most recently visited sites.


### TASK 5: Cat picture uploads: queue

We are implementing two routes, `/upload`, and `/meow` for uploading and displaying the pictures.
 

### TASK 6: Additional server instance

We are running an additional server instance on localhost:3001. 
Running on separate terminals:
```
node main.js 3000
node main.js 3001
```
We can send service requests to both the servers on the browser as seen in the screencast.


### TASK 7: Proxy server
We have created a proxy server which is running on port 8080 and are sending the requests to it.
The proxy server then load-balances the requests to two separate server instances on ports 3000 and 3001. 
Running on separate terminals:
```
node proxy_server.js
node main.js 3000
node main.js 3001
```


### SCREENCAST LINK:

https://youtu.be/TOgWV9DHDSA

Tool used: QuickTime player
___


**File Description:**

+ README.md - this current file.
+ proxy_server.js - the js code which creates and runs the proxy server.
+ main.js - this file runs the requests of set, get, recent and picture uploads.
+ package.json - for building the repo (as part of configuration management task).
+ node_modules - directory automatically created on running npm install and it saves all dependency modules.

