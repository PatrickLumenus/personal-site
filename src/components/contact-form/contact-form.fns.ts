import { baseApiEndpoint, httpRequestTimeout } from "../../constants";
import ServerError from "../../pages/server-error/Server-Error";
import { BadRequestException } from "../../utils/errors/bad-request.exception";
import { ForbiddenException } from "../../utils/errors/forbidden.exception";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";
import { ServerErrorException } from "../../utils/errors/server-error.exception";
import { TooManyRequestsException } from "../../utils/errors/too-many-requests.exception";
import { ContactFormInterface } from "./contact-form-data.interface";

const SUBSCRIPTION_ENDPOINT = `${baseApiEndpoint}/messages/send`;

/**
 * sendMessage()
 * 
 * sends the message.
 * @param formData the data of the message.
 * @thorws BadRequestException when input data is not valid.
 * @thorws ServerErrorException when there is a server error.
 * @throws RequestTimedourException when the request times out.
 * @throws TooManyRequestsException when too many requests are sent too quickly.
 */

export const sendMessage = async (formData: ContactFormInterface): Promise<void> => {

    try {
        // send the http request.
        const abortController = new AbortController();
        const timeoutId = setTimeout(
            () => abortController.abort(),
            httpRequestTimeout
        );
        const response = await fetch(SUBSCRIPTION_ENDPOINT, {
            method: "POST",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                content: formData.message,
                token: formData.token,
            }),
        });
        clearTimeout(timeoutId);

        // process the response.
        if (response.ok) {
            // operation was successful.
            return;
        }
        else if (response.status == 400) {
            // There is an error. Maybe one of the inputs were bad.
            throw new BadRequestException();
        }
        else if (response.status == 403) {
            throw new ForbiddenException();
        }
        else if (response.status == 429) {
            throw new TooManyRequestsException();
        }
        else {
            // internal server error
            throw new ServerErrorException();
        }
    }
    catch (e) {
        // timed out.
        if (e instanceof BadRequestException || e instanceof ServerError) {
            throw e;
        }
        else {
            throw new RequestTimedoutException();
        }
    }
}