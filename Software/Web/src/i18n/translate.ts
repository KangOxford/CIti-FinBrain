"use strict";

let fs = require ("fs");
let https = require ("https");

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = "YOUR KEY HERE";

let host = "api.cognitive.microsofttranslator.com";
let path = "/translate?api-version=3.0";

let text = "Hello, world!";

let response_handler = function(response) {

};

let get_guid = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

let Translate = function(content, params, callback, onerror) {
    const request_params = {
        method : "POST",
        hostname : host,
        path : path + params,
        headers : {
            "Content-Type" : "application/json",
            "Ocp-Apim-Subscription-Key" : subscriptionKey,
            "X-ClientTraceId" : get_guid (),
        },
    };

    const req = https.request (request_params, (response) => {
        let body = "";
        response.on ("data", function(d) {
            body += d;
        });
        response.on ("end", function() {
            const json = JSON.stringify(JSON.parse(body), null, 4);
            try {
                callback(JSON.parse(json));
            } catch (e) {
                onerror(e);
            }

        });
        response.on ("error", function(e) {
            console.log ("Error: " + e.message);
        });
    });
    req.write (content);
    req.end ();
};

let content = JSON.stringify ([{Text : text}]);

module.exports = function translate(contents: string[], to: string[], callback: (result: {text: string, to: string[]}) => void, onerror: (e) => void) {
  Translate(JSON.stringify(contents.map((x) => ({Text: x}))), to.map((x) => "&to=" + x).join(""), (json) => {
      callback(json.map((x) => x.translations));
  }, onerror);
};
