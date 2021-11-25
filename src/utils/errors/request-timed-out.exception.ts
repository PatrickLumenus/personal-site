

export class RequestTimedoutException extends Error {

    constructor(message: string = "Request Timed Out") {
        super(message);
    }
}