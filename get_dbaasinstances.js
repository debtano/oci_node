const https = require('https');
const helper = require('./lib/helper.js');
require('dotenv').config();

const paasUser = process.env.PAAS_USER;
const paasPasswd = process.env.PAAS_PASSWD;
const tenantId = process.env.PAAS_TENANT_ID;
const tenantName = process.env.PAAS_TENANT_NAME;
const dbaasEndpoint = process.env.PAAS_DBAS_ENDPOINT;
const dbaasInstancePath = '/paas/service/dbcs/api/v1.1/instances/' + tenantName
// console.log(dbaasInstancePath)

function getDBAASInstances(callback) {
    const options = {
      hostname: dbaasEndpoint,
      port: 443,
      path: dbaasInstancePath,
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

function getDBAASInstance(serviceId,callback) {
	const options = {
	  hostname: dbaasEndpoint,
	  port: 443,
	  path: dbaasInstancePath + '/' + serviceId,
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
    getDBAASInstances(function(data) {
        console.log(JSON.stringify(data))
    });
} else {
    getDBAASInstance(argu, function(data) {
        console.log(JSON.stringify(data))
    });
}
