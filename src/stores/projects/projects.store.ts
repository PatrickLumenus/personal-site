import { createStore } from 'solid-js/store';
import { baseApiEndpoint, httpRequestTimeout } from '../../constants';
import { RequestTimedoutException } from '../../utils/errors/request-timed-out.exception';
import { ServerErrorException } from '../../utils/errors/server-error.exception';
import { GetLatestProjectsResponseInterface } from './interfaces/get-latest-projects-response.interfacce';
import { GetProjectByIdResponseInterface } from './interfaces/get-project-by-id-response.interface';
import { ProjectInterface } from './interfaces/project.interface';

const BASE_PROJECTS_COUNT = 10;
const BASE_PROJECTS_ENDPOINT = `${baseApiEndpoint}/portfolio`;
const SEARCH_PROJECTS_ENDPOINT = `${baseApiEndpoint}/search/projects`;

/**
 * The projects Store.
 */
const [projects, setProjects] = createStore({
    latest: [] as ProjectInterface[],
    searchResults: {
        query: "",
        results: [] as ProjectInterface[]
    },
    hasUnloadedContent: true,
    retrievedProjects: [] as ProjectInterface[],
    get latestProjectCount(): number {
        return this.latest.length;
    },
    get searchResultCount(): number {
        return this.searchResults.results.length;
    }
}, { name: "projects" });

/**
 * containsProject()
 * 
 * checks if the project is contained in the store.
 * @param project the project to check.
 * @returns TRUE if the project is contained in the store. FALSE otherwise.
 */
const containsProject = (project: ProjectInterface): boolean => {
    const target = projects.retrievedProjects.filter(suspect => suspect.id === project.id);
    return target.length > 0;
}

/**
 * containedInSearchResults()
 * 
 * determines if the suspect is contained in the search results.
 * @param suspect the project to check
 * @returns TRUE if the suspect is contained in the search results. FALSE otherwise.
 */

const containedInSearchResults = (suspect: ProjectInterface): boolean => {
    const target = projects.searchResults.results.filter(suspect => suspect.id === suspect.id);
    return target.length > 0;
}

/**
 * clearSearchResults()
 * 
 * clears the search results.
 */

const clearSearchResults = () => {
    setProjects(prev => {
        return {
            latest: prev.latest,
            hasUnloadedContent: prev.hasUnloadedContent,
            retrievedProjects: prev.retrievedProjects,
            searchResults: {
                query: "",
                results: [],
            }
        }
    })
}

/**
 * getLatestProjects()
 * 
 * gets the latest projects 
 * @throws ServerErrorException when there is s a server error.
 * @throws RequestTimedoutException when the server cannot be reached.
 */

export const getLatestProjects = async (): Promise<ProjectInterface[]> => {

    if (projects.hasUnloadedContent) {
        // get latest projects from server.

        // make the request.
        try {
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
            const response = await fetch(`${BASE_PROJECTS_ENDPOINT}?count=${BASE_PROJECTS_COUNT}&offset=${projects.latestProjectCount}`, {
                signal: abortController.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // process the response.
                const body = await response.json() as GetLatestProjectsResponseInterface;
                const newProjects = body.data.filter(suspect => !containsProject(suspect));
                const loadedAll = newProjects.length < BASE_PROJECTS_COUNT;
                setProjects((prev) => {
                    return {
                        latest: [...newProjects, ...prev.latest],
                        searchResults: prev.searchResults,
                        hasUnloadedContent: !loadedAll,
                        retrievedProjects: [...prev.retrievedProjects, ...body.data.filter(project => !containsProject(project))],
                    };
                });
            }
            else if (response.status == 404) {
                // no more projects to load.
                setProjects(prev => {
                    return {
                        latest: prev.latest,
                        hasUnloadedContent: false,
                        retrievedProjects: prev.retrievedProjects,
                        searchResults: prev.searchResults,
                    }
                });
            }
            else {
                // its a server error.
                console.log(response.status);
                throw new ServerErrorException();
            }
        }
        catch(e) {
            console.log(e)
            if (e instanceof ServerErrorException) {
                throw e;
            }
            else {
                // request timeout.
                throw new RequestTimedoutException();
            }
        }
    }
    return projects.latest;
}

/**
 * getProjectById()
 * 
 * gets a project by its id.
 * @param id the id of the project to get.
 * @returns The project associated with the provided id, or null if it does not exist.
 * @throws an exception when there is a server error.
 */

export const getProjectById = async (id: string): Promise<ProjectInterface | null> => {
    // check if the project is in the store.
    let target: ProjectInterface|null = null;
    let inStoreValue = projects.retrievedProjects.filter(suspect => suspect.id === id);

    if (inStoreValue.length === 0) {
        // it is not in the store. So, we retrieve it from the server.
        try {
            const abortController = new AbortController();
            const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
            const response = await fetch(`${BASE_PROJECTS_ENDPOINT}/project/${id}`, {
                signal: abortController.signal,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                // process the response.
                const body = await response.json() as GetProjectByIdResponseInterface;

                // add the project to the store.
                setProjects((prev) => {
                    return {
                        latest: prev.latest,
                        searchResults: prev.searchResults,
                        hasUnloadedContent: prev.hasUnloadedContent,
                        retrievedProjects: [...prev.retrievedProjects, body.data!]
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
        catch(e) {
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
 * getProjectsBySearchCriteria()
 * 
 * gets a list of projects based on a search criteria.
 * @param query the search query.
 * @returns an array of projects based on the query.
 * @throws ServerErrorException when there is a server exception.
 * @throws RequestTimedoutException when the server cannot be reached.
 */

export const getProjectsBySearchCriteria = async (query: string): Promise<ProjectInterface[]> => {
    // clear the search results from the previous search.
    if (query != projects.searchResults.query) {
        clearSearchResults();
    }

    // perform the search.
    try {
        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), httpRequestTimeout);
        const response = await fetch(`${SEARCH_PROJECTS_ENDPOINT}?query=${query}`, {
            signal: abortController.signal,
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                count: 10,
                offset: projects.searchResultCount,
            })
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const body = await response.json() as GetLatestProjectsResponseInterface;

            // add the results to the store.
            setProjects(prev => {
                return {
                    latest: prev.latest,
                    hasUnloadedContent: prev.hasUnloadedContent,
                    retrievedProjects: [...prev.retrievedProjects, ...body.data.filter(suspect => !containsProject(suspect))],
                    searchResults: {
                        query: query,
                        results: [...prev.searchResults.results, ...body.data.filter(suspect => !containedInSearchResults(suspect))],
                    }
                };
            });
            return body.data;
        }
        else {
            // there was a server error.
            throw new ServerErrorException();
        }
    }
    catch(e) {
        if (e instanceof ServerErrorException) {
            throw e;
        }
        else {
            // request timed out.
            throw new RequestTimedoutException();
        }
    }
}

/**
 * hasUnloadedProjectContent()
 * 
 * determines if there are any unloaded content.
 * @returns TRUE if there are unloaded project.
 */
export const hasUnloadedProjectContent = () => projects.hasUnloadedContent;