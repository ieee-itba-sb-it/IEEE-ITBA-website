import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SponsorsService } from 'src/app/core/services/sponsors/sponsors.service';
import { Sponsor, SponsorCategory } from 'src/app/shared/models/sponsors';

interface SponsorCategoryTab {
    category: SponsorCategory;
    titleKey: string;
    sponsors: Sponsor[];
}

@Component({
    selector: 'app-sponsors-admin',
    templateUrl: './sponsors.component.html',
    styleUrls: ['./sponsors.component.css']
})
export class SponsorsAdminComponent implements OnInit {

    loading = new BehaviorSubject<boolean>(true);

    uploadingCategory: SponsorCategory | null = null;
    deletingSponsorImg: string | null = null;

    tabs: SponsorCategoryTab[];

    constructor(private sponsorsService: SponsorsService, private snackBar: MatSnackBar) {
        this.tabs = [
            { category: 'current', titleKey: 'ADMIN.SPONSORSTAB.CATEGORIES.CURRENT', sponsors: this.sponsorsService.currentSponsors },
            { category: 'previous', titleKey: 'ADMIN.SPONSORSTAB.CATEGORIES.PREVIOUS', sponsors: this.sponsorsService.previousSponsors },
            { category: 'ieeextreme', titleKey: 'ADMIN.SPONSORSTAB.CATEGORIES.IEEEXTREME', sponsors: this.sponsorsService.ieextremeSponsors },
            { category: 'asimov', titleKey: 'ADMIN.SPONSORSTAB.CATEGORIES.ASIMOV', sponsors: this.sponsorsService.asimovSponsors },
        ];
    }

    ngOnInit(): void {
        this.sponsorsService.refreshAll().finally(() => this.loading.next(false));
    }

    onFileSelected(category: SponsorCategory, event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showError('El archivo seleccionado debe ser una imagen.');
            return;
        }

        this.uploadingCategory = category;
        this.sponsorsService.uploadSponsor(category, file)
            .catch(() => this.showError('No se pudo subir el sponsor.'))
            .finally(() => this.uploadingCategory = null);
    }

    deleteSponsor(category: SponsorCategory, sponsor: Sponsor) {
        if (!confirm(`¿Eliminar el sponsor "${sponsor.name}"?`)) return;

        this.deletingSponsorImg = sponsor.img;
        this.sponsorsService.deleteSponsor(category, sponsor)
            .catch(() => this.showError('No se pudo eliminar el sponsor.'))
            .finally(() => this.deletingSponsorImg = null);
    }

    private showError(message: string) {
        this.snackBar.open(message, 'Cerrar', { duration: 4000 });
    }
}
