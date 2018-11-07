var fs = require('fs');
var https = require('https');
var os = require('os');
var helper = require('./lib/helper.js');
require('dotenv').config();

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

function getInstance(instanceId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/instances/" + encodeURIComponent(instanceId),
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

var argu = process.argv[2]

if (argu === "all") {
    getAllInstances(compartmentId, function(data) {
        console.log(JSON.stringify(data))
    });
} else {
    getInstance(argu, function(data) {
        console.log(JSON.stringify(data))
    });
}
