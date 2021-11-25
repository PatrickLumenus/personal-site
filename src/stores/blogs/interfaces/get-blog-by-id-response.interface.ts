import { BlogInterface } from "./blog.interface";

/**
 * GetBlogByIdResponseInterface 
 * 
 * A response interface for geting a blog post by its id.
 */

export interface GetBlogByIdResponseInterface {
    status_code: number;
    status: string;
    data: BlogInterface | null;
}