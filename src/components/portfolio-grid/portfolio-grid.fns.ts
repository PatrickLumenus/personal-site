import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";

/**
 * getMessageForError()
 * 
 * getMessageForError() converts a message. 
 * @param e the eror to process.
 * @returns an error message based on the error provided.
 */

export const getMessageForError = (e: Error): string => {
    let message = "";

    if (e instanceof RequestTimedoutException) {
        message = "The server cannot be reached. Please try again in a little bit.";
    }
    else {
        message = "Something went wrong on our end. Please try again in a little bit.";
    }

    return message;
}