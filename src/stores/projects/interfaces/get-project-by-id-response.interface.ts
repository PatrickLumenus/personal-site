import { ProjectInterface } from "./project.interface";

/**
 * Response interface for getting a project by its id.
 */

export interface GetProjectByIdResponseInterface {
    status_code: number;
    status: string;
    data: ProjectInterface | null
}