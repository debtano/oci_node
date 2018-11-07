/*
    Version 1.0.1

    Before running this example, install necessary dependencies by running:
    npm install http-signature jssha
*/

const fs = require('fs');
const https = require('https');
const os = require('os');
const helper = require('./lib/helper.js');
require('dotenv').config();

const tenancyId = process.env.TENANCY_ID;
const authUserId = process.env.AUTHUSER_ID;
const keyFingerprint = process.env.KEY_FINGERPRINT;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const coreServicesDomain = process.env.CORE_SERVICE_DOMAIN;
const identityDomain = process.env.IDENTITY_DOMAIN;
const compartmentId = process.env.COMPARTMENT_ID;
const vcnId = process.env.VCN_ID;

if (privateKeyPath.indexOf("~/") === 0) {
    privateKeyPath = privateKeyPath.replace("~", os.homedir())
}

const privateKey = fs.readFileSync(privateKeyPath, 'ascii');

// gets the OCI instance with the specified id
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

// test the above functions
// console.log("getting list of subnets:");

getSubnets(compartmentId, vcnId, function(data) {
    console.log(JSON.stringify(data))
});
