import { User } from './user.interface';

export interface BlogEntry {
    id?: number;
    activated?: boolean;
    username?: string;
    pseudo?: string;
    email?: string;
    d_creation?: Date;
    role: string,
    // updatedAt?: Date;
    // likes?: number;
    // author?: User;
    // headerImage?: string;
    // publishedDate?: Date;
    // isPublished?: boolean;
}

export interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface Links {
    first: string;
    previous: string;
    next: string;
    last: string;
}

// export interface BlogEntriesPageable {
//     items: BlogEntry[];
//     meta: Meta;
//     links: Links;
// }