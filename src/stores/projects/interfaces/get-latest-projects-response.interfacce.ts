import { ProjectInterface } from "./project.interface";


export interface GetLatestProjectsResponseInterface {
    status_code: number;
    status: string;
    data: ProjectInterface[];
}