const httpErrorClass = class HttpError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.msg = message;
    }
}

module.exports = httpErrorClass