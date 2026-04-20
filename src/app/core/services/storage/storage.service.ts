/**
 * Abstract base class used as the DI token for storage operations.
 * Inject this type (StorageService) in all consumers — never the concrete implementations.
 */

export interface StorageFileInfo {
    /** Filename without path */
    name: string;
    /** Unique id of the stored object */
    id: string;
    /** Full path inside the bucket, e.g. 'news-images/ref/main.jpg' */
    fullPath: string;
    /** Publicly accessible URL for this file */
    publicUrl: string;
}

export abstract class StorageService {
    /**
     * Uploads a Blob and returns its publicly accessible URL.
     * @param path   Storage path including folders, e.g. 'news-images/ref/main.jpg'
     * @param blob   File data to upload
     * @param mimeType  Optional MIME type, e.g. 'image/jpeg'
     */
    abstract upload(path: string, blob: Blob, mimeType?: string): Promise<string>;

    /**
     * Returns the public URL for a given storage path without making a network request.
     */
    abstract getPublicUrl(path: string): string;

    /**
     * Deletes one or more files. Accepts storage paths OR full public URLs.
     */
    abstract delete(pathOrUrl: string | string[]): Promise<void>;

    /**
     * Lists all files under a prefix/folder.
     * Returns an empty array if the folder doesn't exist.
     */
    abstract list(prefix: string): Promise<StorageFileInfo[]>;
}
