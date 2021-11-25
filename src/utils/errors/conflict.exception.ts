

export class ConflictException extends Error {
    constructor(message: string = "Conflict Error") {
        super(message);
    }
}