const https = require('https');
const helper = require('./lib/helper.js');
require('dotenv').config();

const paasUser = process.env.PAAS_USER;
const paasPasswd = process.env.PAAS_PASSWD;
const tenantId = process.env.PAAS_TENANT_ID;
const tenantName = process.env.PAAS_TENANT_NAME;
const jcsEndpoint = process.env.PAAS_JCS_ENDPOINT;
const jcsInstancesPath = '/paas/api/v1.1/instancemgmt/' + tenantName + '/services/jaas/instances'


function getJCSInstances(callback) {
	const options = {
	  hostname: jcsEndpoint,
	  port: 443,
	  path: jcsInstancesPath,
	  auth: paasUser + ":" + paasPasswd,
	  method: 'GET',
	  headers: {
	    'X-ID-TENANT-NAME': tenantId,
	  }
	};

	// console.log(options)
	var request = https.request(options, helper.handleRequest(callback));
	request.end();

};

function getJCSInstance(serviceId,callback) {
	const options = {
	  hostname: jcsEndpoint,
	  port: 443,
	  path: jcsInstancesPath + '/' + serviceId,
	  auth: paasUser + ":" + paasPasswd,
	  method: 'GET',
	  headers: {
	    'X-ID-TENANT-NAME': tenantId,
	  }
	};

	// console.log(options)
	var request = https.request(options, helper.handleRequest(callback));
	request.end();

};

var argu = process.argv[2]

if (argu === "all") {
    getJCSInstances(function(data) {
        console.log(JSON.stringify(data))
    });
} else {
    getJCSInstance(argu, function(data) {
        console.log(JSON.stringify(data))
    });
}
