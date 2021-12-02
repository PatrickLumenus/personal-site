import { baseApiEndpoint, httpRequestTimeout } from "../../constants";
import { BadRequestException } from "../../utils/errors/bad-request.exception";
import { ForbiddenException } from "../../utils/errors/forbidden.exception";
import { NotFoundException } from "../../utils/errors/not-found.exception";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";
import { ServerErrorException } from "../../utils/errors/server-error.exception";
import { TooManyRequestsException } from "../../utils/errors/too-many-requests.exception";

const UNSUBSCRIBE_ENDPOINT = `${baseApiEndpoint}/subscriptions/unsubscribe`;

/**
 * unsubscribeEmail()
 * 
 * removes an email from the mailing list.
 * @param email the email address to search for.
 * @param token the recaptcha token.
 * @throws BadRequest when the email address is invalid.
 * @throws ForbiddenException when the token is invalid.
 * @throws TooManyRequestsException when too many requests have been sent.
 * @throws ServerErrorException when there is a server error.
 */

export const unsubscribeEmail = async (email: string, token: string): Promise<void> => {
    try {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
        const response = await fetch(UNSUBSCRIBE_ENDPOINT, {
            signal: abortController.signal,
            method: 'delete',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                token: token
            })
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            // process the response.
            return;
        }
        else if (response.status == 400) {
            // the input is invalid.
            throw new BadRequestException();
        }
        else if (response.status == 403) {
            throw new ForbiddenException();
        }
        else if (response.status == 404) {
            // email not foiund
            throw new NotFoundException();
        }
        else if (response.status == 429) {
            throw new TooManyRequestsException();
        }
        else {
            // its a server error.
            throw new ServerErrorException();
        }
    }
    catch (e) {
        console.log(e)
        if (
            (e instanceof ServerErrorException) ||
            (e instanceof TooManyRequestsException) ||
            (e instanceof NotFoundException) ||
            (e instanceof ForbiddenException) ||
            (e instanceof BadRequestException)
        ) {
            throw e;
        }
        else {
            // request timeout.
            throw new RequestTimedoutException();
        }
    }
}