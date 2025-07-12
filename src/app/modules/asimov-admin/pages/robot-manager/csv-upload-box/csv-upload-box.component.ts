import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Robot } from "../../../../../shared/models/event/asimov/robot";
import { Papa } from "ngx-papaparse";

@Component({
    selector: 'app-csv-upload-box',
    templateUrl: './csv-upload-box.component.html',
    styleUrls: ['./csv-upload-box.component.css']
})
export class CsvUploadBoxComponent {
    @Output() csvParsed = new EventEmitter<any[]>();
    isDragging = false;

    constructor(private _snackBar: MatSnackBar, private papa: Papa) { }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = false;

        if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            this.handleFile(file);
        } else {
            this.showNotification('No se detectó ningún archivo.', 'error');
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.handleFile(file);
        } else {
            this.showNotification('No se seleccionó ningún archivo.', 'error');
        }
    }

    private handleFile(file: File): void {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            this.showNotification('Por favor, selecciona un archivo CSV (.csv).', 'error');
            return;
        }

        this.papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                if (result.errors.length > 0) {
                    console.error('Errores al parsear CSV:', result.errors);
                    this.showNotification('Hubo errores al procesar el archivo CSV.', 'error');
                    return;
                }

                this.csvParsed.emit(result.data as Robot[]);
                this.showNotification('Archivo CSV cargado y procesado con éxito.', 'success');
            },
            error: (err: any) => {
                console.error('Error general de Papa Parse:', err);
                this.showNotification(`Error al procesar el archivo CSV: ${err.message}`, 'error');
            }
        });
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        this._snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
