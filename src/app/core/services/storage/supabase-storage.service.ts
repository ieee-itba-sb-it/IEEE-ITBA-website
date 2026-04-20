import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, supabaseBucket } from '../../../secrets';

export interface SupabaseFileInfo {
    name: string;
    id: string;
    fullPath: string;
    publicUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class SupabaseStorageService {

    private readonly supabase: SupabaseClient;
    private readonly bucket = supabaseBucket;

    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    /**
     * Uploads a Blob to Supabase Storage and returns the permanent public URL.
     * @param path - Storage path including folder, e.g. 'news-images/ref/img.jpg'
     * @param blob - The file Blob to upload
     * @param mimeType - MIME type of the file (e.g. 'image/jpeg')
     */
    async upload(path: string, blob: Blob, mimeType?: string): Promise<string> {
        const { error } = await this.supabase.storage
            .from(this.bucket)
            .upload(path, blob, {
                contentType: mimeType || blob.type || 'application/octet-stream',
                upsert: true,
            });

        if (error) throw error;

        return this.getPublicUrl(path);
    }

    /**
     * Returns the permanent public URL for a given storage path.
     */
    getPublicUrl(path: string): string {
        const { data } = this.supabase.storage
            .from(this.bucket)
            .getPublicUrl(path);
        return data.publicUrl;
    }

    /**
     * Deletes one or more files from storage.
     * Accepts full public URLs or storage paths.
     */
    async delete(pathOrUrl: string | string[]): Promise<void> {
        const paths = Array.isArray(pathOrUrl) ? pathOrUrl : [pathOrUrl];
        const storagePaths = paths.map(p => this.toStoragePath(p));

        const { error } = await this.supabase.storage
            .from(this.bucket)
            .remove(storagePaths);

        if (error) throw error;
    }

    /**
     * Lists all files under a given prefix/folder.
     * Returns file info including the public URL for each file.
     */
    async list(prefix: string): Promise<SupabaseFileInfo[]> {
        const { data, error } = await this.supabase.storage
            .from(this.bucket)
            .list(prefix, { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

        if (error) throw error;
        if (!data) return [];

        // Filter out placeholder "folder" entries (they have no id)
        return data
            .filter(item => item.id !== null)
            .map(item => {
                const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
                return {
                    name: item.name,
                    id: item.id,
                    fullPath,
                    publicUrl: this.getPublicUrl(fullPath),
                };
            });
    }

    /**
     * Converts a full public URL back to its storage path.
     * If already a path (no http), returns as-is.
     */
    private toStoragePath(urlOrPath: string): string {
        if (!urlOrPath.startsWith('http')) return urlOrPath;
        // URL format: {supabaseUrl}/storage/v1/object/public/{bucket}/{path}
        const marker = `/object/public/${this.bucket}/`;
        const idx = urlOrPath.indexOf(marker);
        if (idx === -1) return urlOrPath;
        return decodeURIComponent(urlOrPath.substring(idx + marker.length));
    }
}
