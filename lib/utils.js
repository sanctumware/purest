
// converts params into a query string
function toQueryString (params) {
    function escape (str) {
        return encodeURIComponent(str).replace(/[!*()']/g, function (character) {
            return '%' + character.charCodeAt(0).toString(16);
        });
    }
    var result = [];
    for (var name in params) {
        result.push(name+'='+escape(params[name]));
    }
    return result.join('&');
}

// create an url path for the given api and encode the params into it
exports.qs = function (api, params) {
    var params = params || {},
        path = this.createPath(api);
    if (Object.keys(params).length) {
        path += '?'+toQueryString(params);
    }
    return path;
}

exports.response = function (cb) {
    return function (err, res, body) {
        if (!cb) return;
        if (err) return cb(err, res, body);
        if (typeof body === 'string') {
            try {body = JSON.parse(body)}
            catch (e) {return cb(new Error('Parse error!'), res, body)}
        }
        if(res.statusCode!=200 && res.statusCode!=201 && 
            res.statusCode!=301 && res.statusCode!=302)
            return cb(body, res, body);
        cb(err, res, body);
    }
}