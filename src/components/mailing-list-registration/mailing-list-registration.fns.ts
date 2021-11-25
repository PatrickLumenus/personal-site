import { baseApiEndpoint, httpRequestTimeout } from "../../constants";
import { BadRequestException } from "../../utils/errors/bad-request.exception";
import { ConflictException } from "../../utils/errors/conflict.exception";
import { ForbiddenException } from "../../utils/errors/forbidden.exception";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";
import { ServerErrorException } from "../../utils/errors/server-error.exception";
import { TooManyRequestsException } from "../../utils/errors/too-many-requests.exception";
import { SubscriptionCredentials } from "./subscription-credentials.interface";


const SUBSCRIBE_TO_MAILING_LIST_ENDPOINT = `${baseApiEndpoint}/subscriptions/subscribe`;

/**
 * getEmailErrors()
 * 
 * determines if the email value is valid.
 * @param suspect the suspect to test.
 * @returns an empty string if there are no errros. An error message if there are.
 */

export const getEmailErrors = (suspect: string): string => {
    if (suspect.trim().length == 0) {
        return "This field is required.";
    }

    const VALID_EMAIL_REGEX = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$"
    );

    if (!VALID_EMAIL_REGEX.test(suspect)) {
        return "Please enter a valid email address.";
    }

    // email is valid
    return "";
}

/**
 * getNameErrors()
 * 
 * checks if there are any errors with the name value.
 * @param suspect the value to test.
 * @returns an empty string if there are no errors. An error message if there are errors.
 */

export const getNameErrors = (suspect: string): string => {
    const trimmedNme = suspect.trim();

    if (trimmedNme.length == 0) {
        return "This field is required.";
    }

    return "";
}

/**
 * createMailingListSubscription()
 * 
 * creates a subscription based on the credentials.
 * @param credentials the credentials to submit.
 * @throws BadRequestException when the credentials are invalid.
 * @throws ForbiddenException when the sender is barred from creating a subscription.
 * @throws ConflictException when the email address is already in use.
 * @throws TooManyRequestsException when there are too many requests.
 * @throws ServerErrorException when there is a server error.
 * @throws RequestTimedOutException when the server cannot be reached.
 */

export const createMailingListSubscription = async (credentials: SubscriptionCredentials): Promise<void> => {
    try {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
        const response = await fetch(SUBSCRIBE_TO_MAILING_LIST_ENDPOINT, {
            method: 'POST',
            signal: abortController.signal,
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: credentials.name,
                email: credentials.email,
                token: credentials.token
            })
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            // response was successful.
        }
        else if (response.status == 400) {
            // invalid input.
            throw new BadRequestException();
        }
        else if (response.status == 403) {
            // the sender is probably a bot.
            throw new ForbiddenException();
        }
        else if (response.status == 409) {
            // email already in use.
            throw new ConflictException();
        }
        else if (response.status == 429) {
            // too many requests.
            throw new TooManyRequestsException();
        }
        else {
            // server error.
            throw new ServerErrorException();
        }
    }
    catch(e) {
        if (
            (e instanceof BadRequestException) ||
            (e instanceof ConflictException) ||
            (e instanceof ForbiddenException) ||
            (e instanceof TooManyRequestsException) ||
            (e instanceof ServerErrorException)
        ) {
            // its one of the errors thrown by the server.
            throw e;
        }
        else {
            // request timed out.
            throw new RequestTimedoutException();
        }
    }
}