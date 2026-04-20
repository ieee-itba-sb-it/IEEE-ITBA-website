import { Injectable } from '@angular/core';
import { StorageService, StorageFileInfo } from './storage.service';

/**
 * Dev-only in-memory storage mock.
 * Stores uploaded files as browser ObjectURLs so they render immediately in the UI.
 * No network calls, no external services — works alongside Firebase emulators as-is.
 *
 * Limitations:
 * - Files are lost on page reload (ObjectURLs are session-scoped).
 * - Not provided in 'root' — registered only in dev via app.module.ts.
 */
@Injectable()
export class LocalStorageService extends StorageService {

    /** path → { objectUrl, name } */
    private readonly store = new Map<string, { url: string; name: string }>();

    async upload(path: string, blob: Blob, mimeType?: string): Promise<string> {
        // Revoke any previous ObjectURL at this path to avoid memory leaks
        const existing = this.store.get(path);
        if (existing) URL.revokeObjectURL(existing.url);

        const url = URL.createObjectURL(blob);
        const name = path.split('/').pop() ?? path;
        this.store.set(path, { url, name });

        console.debug(`[LocalStorage] Uploaded: ${path} → ${url}`);
        return url;
    }

    getPublicUrl(path: string): string {
        return this.store.get(path)?.url ?? '';
    }

    async delete(pathOrUrl: string | string[]): Promise<void> {
        const targets = Array.isArray(pathOrUrl) ? pathOrUrl : [pathOrUrl];

        for (const target of targets) {
            // Try direct path match first
            if (this.store.has(target)) {
                URL.revokeObjectURL(this.store.get(target)!.url);
                this.store.delete(target);
                console.debug(`[LocalStorage] Deleted by path: ${target}`);
                continue;
            }
            // Fallback: search by ObjectURL value
            for (const [key, val] of this.store) {
                if (val.url === target) {
                    URL.revokeObjectURL(val.url);
                    this.store.delete(key);
                    console.debug(`[LocalStorage] Deleted by URL: ${key}`);
                    break;
                }
            }
        }
    }

    async list(prefix: string): Promise<StorageFileInfo[]> {
        const results: StorageFileInfo[] = [];
        const normalizedPrefix = prefix.endsWith('/') ? prefix : prefix + '/';

        for (const [fullPath, { url, name }] of this.store) {
            if (fullPath.startsWith(normalizedPrefix)) {
                results.push({ name, id: fullPath, fullPath, publicUrl: url });
            }
        }

        console.debug(`[LocalStorage] Listed '${prefix}': ${results.length} file(s)`);
        return results;
    }
}
