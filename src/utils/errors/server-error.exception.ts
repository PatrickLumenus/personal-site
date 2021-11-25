

export class ServerErrorException extends Error {
    constructor(message: string = "Server Error") {
        super(message);
    }
}