/*
    Version 1.0.1

    Before running this example, install necessary dependencies by running:
    npm install http-signature jssha
*/

var fs = require('fs');
var https = require('https');
var os = require('os');
var helper = require('./lib/helper.js');
require('dotenv').config();

// TODO: update these values to your own

var tenancyId = process.env.TENANCY_ID;
var authUserId = process.env.AUTHUSER_ID;
var keyFingerprint = process.env.KEY_FINGERPRINT;
var privateKeyPath = process.env.PRIVATE_KEY_PATH;
var coreServicesDomain = process.env.CORE_SERVICE_DOMAIN;
var compartmentId = process.env.COMPARTMENT_ID;


if(privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}
var privateKey = fs.readFileSync(privateKeyPath, 'ascii');

// gets the OCI instance with the specified id
function getAllInstances(compartmentId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/instances/" + "?compartmentId=" + compartmentId,
    };

    var request = https.request(options, helper.handleRequest(callback));

    helper.sign(request, {
        privateKey: privateKey,
        keyFingerprint: keyFingerprint,
        tenancyId: tenancyId,
        userId: authUserId
    });

    request.end();
};

// test the above functions
// console.log("GET ALL INSTANCES:");

getAllInstances(compartmentId, function(data) {
   console.log(JSON.stringify(data))
});