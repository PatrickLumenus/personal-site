export class TooManyRequestsException extends Error {
    constructor(message: string = "Too many requests") {
        super(message);
    }
}