import { Document } from '@contentful/rich-text-types';

export interface BlogInterface {
    id: string;
    title: string;
    summary: string;
    content: Document;
    created_at: {
        date: string,
        tz: {
            _id: string;
            _abbreviation: string;
            _offset: number
        }
    },
    cover: {
        source: string;
        description: string;
        contentType: string;
        width: number;
        height: number;
        size: number;
    }
}