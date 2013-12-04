var channel = (function () {

var exports = {};

function call(args) {
    // Wrap the error handlers to reload the page if we get a CSRF error
    // (What probably happened is that the user logged out in another tab).
    var orig_error = args.error;
    if (orig_error === undefined) {
        orig_error = function () {};
    }
    args.error = function wrapped_error(xhr, error_type, xhn) {
        if (xhr.status === 403 && $.parseJSON(xhr.responseText).msg.indexOf("CSRF Error:") !== -1) {
            reload.initiate({immediate: true});
        }
        return orig_error(xhr, error_type, xhn);
    };

    return $.ajax(args);
}

exports.get = function (options) {
    var args = _.extend({type: "GET", dataType: "json"}, options);
    return call(args);
};

exports.post = function (options) {
    var args = _.extend({type: "POST", dataType: "json"}, options);
    return call(args);
};

exports.put = function (options) {
    var args = _.extend({type: "PUT", dataType: "json"}, options);
    return call(args);
};

// Not called exports.delete because delete is a reserved word in JS
exports.del = function (options) {
    var args = _.extend({type: "DELETE", dataType: "json"}, options);
    return call(args);
};

exports.patch = function (options) {
    // Send a PATCH as a POST in order to work around QtWebkit
    // (Linux/Windows desktop app) not supporting PATCH body.
    options.method = "PATCH";
    if (options.processData === false) {
        // If we're submitting a FormData object, we need to add the
        // method this way
        options.data.append("method", "PATCH");
    }
    return exports.post(options);
};

return exports;

}());