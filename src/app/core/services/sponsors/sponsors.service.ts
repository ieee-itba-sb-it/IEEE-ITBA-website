import { Injectable } from '@angular/core';
import { Sponsor, SponsorCategory } from 'src/app/shared/models/sponsors';
import { StorageService } from '../storage/storage.service';

const CATEGORY_FOLDERS: Record<SponsorCategory, string> = {
    current: 'sponsors/current',
    previous: 'sponsors/previous',
    ieeextreme: 'sponsors/ieeextreme',
    asimov: 'sponsors/asimov',
};

@Injectable({
    providedIn: 'root'
})
export class SponsorsService {

    // Populated asynchronously from Supabase Storage. Kept as stable array
    // references (updated in place) so components/templates that hold onto
    // these arrays see updates once the storage listing resolves.
    currentSponsors: Sponsor[] = [];
    previousSponsors: Sponsor[] = [];
    ieextremeSponsors: Sponsor[] = [];
    asimovSponsors: Sponsor[] = [];

    constructor(private storageService: StorageService) {
        this.refreshAll();
    }

    getCurrentSponsors() {
        return this.currentSponsors;
    }

    getPreviousSponsors() {
        return this.previousSponsors;
    }

    getIeextremeSponsors() {
        return this.ieextremeSponsors;
    }

    getAsimovSponsors() {
        return this.asimovSponsors;
    }

    refreshAll(): Promise<void[]> {
        return Promise.all([
            this.refreshCategory('current'),
            this.refreshCategory('previous'),
            this.refreshCategory('ieeextreme'),
            this.refreshCategory('asimov'),
        ]);
    }

    async refreshCategory(category: SponsorCategory): Promise<void> {
        const files = await this.storageService.list(CATEGORY_FOLDERS[category]);
        const sponsors = files.map(file => ({
            name: this.nameFromFilename(file.name),
            img: file.publicUrl,
        }));
        const target = this.arrayFor(category);
        target.splice(0, target.length, ...sponsors);
    }

    async uploadSponsor(category: SponsorCategory, file: File): Promise<void> {
        const path = `${CATEGORY_FOLDERS[category]}/${Date.now()}-${this.sanitizeFilename(file.name)}`;
        await this.storageService.upload(path, file, file.type);
        await this.refreshCategory(category);
    }

    async deleteSponsor(category: SponsorCategory, sponsor: Sponsor): Promise<void> {
        await this.storageService.delete(sponsor.img);
        await this.refreshCategory(category);
    }

    private arrayFor(category: SponsorCategory): Sponsor[] {
        switch (category) {
        case 'current': return this.currentSponsors;
        case 'previous': return this.previousSponsors;
        case 'ieeextreme': return this.ieextremeSponsors;
        case 'asimov': return this.asimovSponsors;
        }
    }

    private nameFromFilename(filename: string): string {
        return filename.replace(/\.[^/.]+$/, '').replace(/^\d+-/, '').replace(/[-_]+/g, ' ');
    }

    private sanitizeFilename(filename: string): string {
        return filename.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
    }
}
