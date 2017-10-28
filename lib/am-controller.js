class AMController {
    // Return error message em http code to request
    returnStatus (res, code, message) {
        res.writeHead(code, message, {'content-type': 'text/plain'});
        res.end(message);
    }
}

module.exports = AMController;
