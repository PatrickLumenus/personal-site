import { Document } from '@contentful/rich-text-types';

/**
 * ProjectInterface
 * 
 * The Project Interface
 */

export interface ProjectInterface {
    id: string;
    title: string;
    description: Document;
    short_description: string;
    repository: URL;
    technologies: string[];
    website: URL | null;
    logo: {
        contentType: string;
        description: string;
        height: number;
        size: number;
        source: URL;
        width: number
    }
}