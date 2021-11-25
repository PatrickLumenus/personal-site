export class BadRequestException extends Error {
    constructor(message: string = "Bad Request") {
        super(message);
    }
}