import { createStore } from 'solid-js/store';
import { baseApiEndpoint, httpRequestTimeout } from '../../constants';
import { RequestTimedoutException } from '../../utils/errors/request-timed-out.exception';
import { ServerErrorException } from '../../utils/errors/server-error.exception';
import { BlogInterface } from './interfaces/blog.interface';
import { GetBlogByIdResponseInterface } from './interfaces/get-blog-by-id-response.interface';
import { GetLatestBlogsResponse } from './interfaces/get-latest-blogs-response.interface';

const BASE_BLOGS_ENDPOINT = `${baseApiEndpoint}/blogs`;
const BASE_BLOGS_COUNT = 10;

const [blogs, setBlogs] = createStore({
    latest: [] as BlogInterface[],
    retrievedBlogs: [] as BlogInterface[],
    hasUnloadedContent: true,
    searchResults: {
        query: "",
        results: [] as BlogInterface[]
    },
    get latestBlogsCount(): number {
        return this.latest.length;
    },
    get searchResultCount(): number {
        return this.searchResults.results.length;
    }
}, { name: 'blogs' });

/**
 * containsBlogPost()
 * 
 * determines if a suspect blog post is contained in the blog store.
 * @param suspect the blog post to search form.
 * @returns TRUE if the suspect is contained in the store. FALSE otherwise.
 */

const containsBlogPost = (suspect: BlogInterface): boolean => {
    const target = blogs.retrievedBlogs.filter(candidate => candidate.id === suspect.id);
    return target.length > 0;
}

/**
 * containedInSearchResults()
 * 
 * determines if the suspect blog is contained in the search results.
 * @param suspect the suspect to search for.
 * @returns TRUE if the suspect is contained in the search results. FALSE otherwise.
 */

const containedInSearchResults = (suspect: BlogInterface) => {
    const target = blogs.searchResults.results.filter(candidate => candidate.id === suspect.id);
    return target.length > 0;
}

/**
 * clearSearchResults()
 * 
 * clears the search results.
 */

const clearSearchResults = () => {
    setBlogs(prev => {
        return {
            latest: prev.latest,
            retrievedBlogs: prev.retrievedBlogs,
            hasUnloadedContent: prev.hasUnloadedContent,
            searchResults: {
                query: "",
                results: [],
            }
        };
    })
}

/**
 * getLatestBlogs()
 * 
 * gets the latest blog posts.
 * @returns the latest blog posts.
 * @throws ServerErrorException when there is a problem with the server.
 * @throws RequestTimedoutException when the request has timed out.
 */

export const getLattestBlogs = async (): Promise<BlogInterface[]> => {
    if (blogs.hasUnloadedContent) {
        // get latest projects from server.

        // make the request.
        try {
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
            const response = await fetch(`${BASE_BLOGS_ENDPOINT}?count=${BASE_BLOGS_COUNT}&offset=${blogs.latestBlogsCount}`, {
                signal: abortController.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // process the response.
                const body = await response.json() as GetLatestBlogsResponse;
                const newBlogs = body.data.filter(suspect => !containsBlogPost(suspect));
                const loadedAll = newBlogs.length < BASE_BLOGS_COUNT;
                setBlogs((prev) => {
                    return {
                        latest: [...newBlogs, ...prev.latest],
                        hasUnloadedContent: !loadedAll,
                        searchResults: prev.searchResults,
                        retrievedBlogs: [...prev.retrievedBlogs, ...body.data.filter(blog => !containsBlogPost(blog))],
                    };
                });
            }
            else if (response.status == 404) {
                setBlogs(prev => {
                    return {
                        latest: prev.latest,
                        hasUnloadedContent: false,
                        searchResults: prev.searchResults,
                        retrievedBlogs: prev.retrievedBlogs,
                    }
                });
            }
            else {
                // its a server error.
                throw new ServerErrorException();
            }
        }
        catch (e) {
            if (e instanceof ServerErrorException) {
                throw e;
            }
            else {
                // request timeout.
                throw new RequestTimedoutException();
            }
        }
    }
    return blogs.latest;
}

/**
 * getBlogById()
 * 
 * gets a blog by its id.
 * @param id the id of the blog to get.
 * @returns The blog associated with the provided id, or null if it does not exist.
 * @throws an exception when there is a server error.
 */

export const getBlogById = async (id: string): Promise<BlogInterface | null> => {
    // check if the project is in the store.
    let target: BlogInterface | null = null;
    let inStoreValue = blogs.retrievedBlogs.filter(suspect => suspect.id === id);

    if (inStoreValue.length === 0) {
        // it is not in the store. So, we retrieve it from the server.
        try {
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
            const response = await fetch(`${BASE_BLOGS_ENDPOINT}/post/${id}`, {
                signal: abortController.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // process the response.
                const body = await response.json() as GetBlogByIdResponseInterface;

                // add the project to the store.
                setBlogs((prev) => {
                    return {
                        latest: prev.latest,
                        searchResults: prev.searchResults,
                        retrievedProjects: [...prev.retrievedBlogs, body.data!]
                    }
                });
                target = body.data!;
            }
            else if (response.status === 404) {
                // project not found.
                target = null;
            }
            else {
                // internal error.
                throw new ServerErrorException();
            }
        }
        catch (e) {
            if (e instanceof ServerErrorException) {
                throw e;
            }
            else {
                // request timed out.
                throw new RequestTimedoutException();
            }
        }
    }
    else {
        // target found.
        target = inStoreValue[0];
    }

    return target;
}

/**
 * hasUnloadedBlogContent()
 * 
 * determines if there are unloaded blog content.
 * @returns TRUE if there are unloaded posts. FALSE otherweise
 */

export const hasUnloadedBlogContent = () => blogs.hasUnloadedContent;