/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
/*globals value */
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});

SupplyChain = require('./supplyChain');

const login = require('./users');

app.post('/login', login);

app.get('/get-health-info', function (req, res,next) {
	//const produceId = req.query.produceId;
	const userName = "admin@healthcare-network";
	let epoc = new SupplyChain(userName);
	epoc.init().then(() => {
		var arr=[];
		return epoc.listHealthInfo().then((produce) => {
			//console.log("produce.length##"+produce.length);
			if(produce.length>0){
				res.send(produce);
			}else{
				res.send('');
			}
		}).catch((error) => {
			res.status(405).send(error);
			//res.send("no data found")
		});
	});
});


app.get('/get-all', function (req, res,next) {
	var ownerId = req.query.employerId;
	//const userName = req.query.userName;
	const userName = "admin@healthcare-network";
	ownerId='E1001';
	let epoc = new SupplyChain(userName);
	epoc.init().then(() => {
		// console.log('Connected!!!!!');
		var arr=[];
		return epoc.listHealthInfoByEmployer(ownerId).then((produce) => {
			//console.log("produce.length##"+produce.length);
			if(produce.length>0){
				res.send(produce);
			}else{
				res.send('No Record found');
			}
		}).catch((error) => {
			res.status(405).send(error);
		});
	});
});

app.post('/update-health-info', function (req, res) {
	console.log('Entered post');
	const healthInfo = req.body.healthInfo;
	const userName = "admin@healthcare-network";
	let epoc = new SupplyChain(userName);
	epoc.init().then(() => {
		return epoc.updateHealthInfo(healthInfo).then((success) => {
			if (success) {
				res.send();
			} else {
				res.status(405).send("permission denied");
			}
		});
	});
});


app.get('/get-history', function (req, res) {
	const produceId = req.query.produceId;
	//let epoc = new SupplyChain('farmer2@poc');
	const userName = req.query.userName;
	let epoc = new SupplyChain(userName);
	epoc.init().then(() => {
		return epoc.getHistory(produceId).then((payload) => {
			// console.log(JSON.stringify(payload, null, 2), payload.length);
			if (payload) {
				res.send(payload)
			}
			
		}).catch((error) => {
			res.status(405).send(error);
		})
	})
	// res.status(500).send();
});


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
	// print a message when the server starts listening
	console.log("server starting on " + appEnv.url);
});