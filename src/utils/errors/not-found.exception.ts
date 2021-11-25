

export class NotFoundException extends Error {
    constructor(message: string = "Not Found") {
        super(message);
    }
}