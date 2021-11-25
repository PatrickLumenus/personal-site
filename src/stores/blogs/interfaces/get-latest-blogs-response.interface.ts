import { BlogInterface } from "./blog.interface";

/**
 * GetLatestBlogsResponse
 * 
 * A response interface for getting the latest blogs.
 */

export interface GetLatestBlogsResponse {
    status_code: number;
    status: string;
    data: BlogInterface[];
}