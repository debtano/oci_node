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
var identityDomain = process.env.IDENTITY_DOMAIN;
var compartmentId = process.env.COMPARTMENT_ID;
var vcnId = process.env.VCN_ID;

if (privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}
var privateKey = fs.readFileSync(privateKeyPath, 'ascii');

function getRouteTables(compartmentId, vcnId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/routeTables/" + "?compartmentId=" + compartmentId + "&vcnId=" + vcnId
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

function getRouteTable(rtId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/routeTables/" + encodeURIComponent(rtId)
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
    getRouteTables(compartmentId, vcnId, function(data) {
        console.log(JSON.stringify(data))
    });
} else {
    getRouteTable(argu, function(data) {
        console.log(JSON.stringify(data))
    });
}