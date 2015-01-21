# Order Request#

This application is created to help companies have a more efficient workflow when it comes to purchases.

### How do I get set up? ###

* Download and install node.js
* Download and install MongoDB
* Use node command line and zone into that project folder
* run "npm install"
* then "node app"

### Current Stack ###
* Nodejs
* Mongoose (defining database schema)
* MonogoDB
* momentJS (smart time data saving, to be able to convert to any timezone)
* Express - providing the middleware controller
* Handlebars - page rendering
* CasperJS - unit testing
* PhantomJS - unit testing (cont'd)
* NodeMailer - send transaction-based emails
* PassportJS - encryption
* Swagger - auth keys for devs
* Nodules - blueprint of application, so we don't have to restart the server

### Coding Guidelines ###
 
* Do not push broken code
* Create your own branch if it's going to take awhile (your branch, your rules)
* Prove that your code works, unit testing

### Test Users ###
* ordertech(1-10)[at]gmail.com : apptest123

### PUSH Code to Server ###
1. SSH into "www.mixdatup.com"
2. username root
3. password robino68
4. cd "order-request"
5. git pull
6. password: robino68

If Error Merging Use
rmdir -r

If Server Not working Use
tmux
/ node app

### Reset Database ###
1. use Mongo
2. use "orders"
3. db.dropDatabase() <-- This will drop the whole collection
4. In the same folder use "mongorestore (path to dump) <-- Inside the project folder