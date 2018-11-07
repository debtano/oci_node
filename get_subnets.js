var fs = require('fs');
var https = require('https');
var os = require('os');
var helper = require('./lib/helper.js');
require('dotenv').config();

const tenancyId = process.env.TENANCY_ID;
const authUserId = process.env.AUTHUSER_ID;
const keyFingerprint = process.env.KEY_FINGERPRINT;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const coreServicesDomain = process.env.CORE_SERVICE_DOMAIN;
const identityDomain = process.env.IDENTITY_DOMAIN;
const compartmentId = process.env.COMPARTMENT_ID;
const vcnId = process.env.VCN_ID;

if(privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}
var privateKey = fs.readFileSync(privateKeyPath, 'ascii');

function getSubnets(compartmentId, vcnId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/subnets/" + "?compartmentId=" + compartmentId + "&vcnId=" + vcnId
    };

    var request = https.request(options, helper.handleRequest(callback));


    helper.sign(request, {
        privateKey: privateKey,
        keyFingerprint: keyFingerprint,
        tenancyId: tenancyId,
        userId: authUserId
    });

    // console.log(request);
    request.end();
};

function getSubnet(subnetId, callback) {

    var options = {
        host: coreServicesDomain,
        path: "/20160918/subnets/" + encodeURIComponent(subnetId),
    };

    var request = https.request(options, helper.handleRequest(callback));


    helper.sign(request, {
        privateKey: privateKey,
        keyFingerprint: keyFingerprint,
        tenancyId: tenancyId,
        userId: authUserId
    });

    // console.log(request);
    request.end();

};

var argu = process.argv[2]

if (argu === "all") {
    getSubnets(compartmentId, vcnId, function(data) {
        console.log(JSON.stringify(data))
    });
} else {
    getSubnet(argu, function(data) {
        console.log(JSON.stringify(data))
    });
}
