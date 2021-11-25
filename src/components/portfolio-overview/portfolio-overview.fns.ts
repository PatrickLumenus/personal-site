import { ProjectInterface } from "../../stores/projects/interfaces/project.interface";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";

/**
 * getMessageForError()
 * 
 * gets a user friendly message for an error.
 * @param e the error to process.
 * @returns a user-friendly error message based on the error.
 */

export const getMessgeForError = (e: Error): string => {
    let message = "";
    if (e instanceof RequestTimedoutException) {
        message = "The server cannot be reached. Please try again in a little bit.";
    }
    else {
        message = "Something went wrong on our end. Please try again in a little bit.";
    }

    return message;
}

/**
 * getTrimmedProjectList()
 * 
 * gets a subset of the project list to display.
 * @param projects the full list of projects.
 * @returns a subset of the project list.
 */

export const getTrimmedProjectList = (projects?: ProjectInterface[]): ProjectInterface[] => {
    let list: ProjectInterface[] = [];

    if (projects) {
        if (projects.length >= 3) {
            // we have three or more.
            list = projects.slice(0, 3);
        }
        else {
            list = projects;
        }
    }

    return list;
}