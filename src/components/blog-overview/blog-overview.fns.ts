import { BlogInterface } from "../../stores/blogs/interfaces/blog.interface";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";

/**
 * Functions for the Blog Overview component.
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

export const getTrimmedBlogList = (blogs?: BlogInterface[]): BlogInterface[] => {
    let list: BlogInterface[] = [];

    if (blogs) {
        if (blogs.length > 3) {
            list = blogs.slice(0, 3);
        } else {
            list = blogs;
        }
    }

    return list
}