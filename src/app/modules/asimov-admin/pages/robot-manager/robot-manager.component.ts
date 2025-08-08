import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Robot} from "../../../../shared/models/event/asimov/robot";
import {BehaviorSubject, debounceTime, filter, Observable, Subject, takeUntil, tap} from "rxjs";
import {CdkScrollable} from "@angular/cdk/scrolling";
import {AsimovService} from "../../../../core/services/asimov/asimov.service";
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RobotFormDialogComponent} from "./robot-form-dialog/robot-form-dialog.component";
import {Category} from "../../../../shared/models/event/asimov/category";
import {AlertModalComponent} from "../../../../shared/components/alert-modal/alert-modal.component";
import {MDBModalService} from "angular-bootstrap-md";

@Component({
    selector: 'app-robot-manager',
    templateUrl: './robot-manager.component.html',
    styleUrls: ['./robot-manager.component.css']
})
export class RobotManagerComponent implements OnInit {
    displayedColumns = ['selected', 'name', 'category', 'id', 'picture', 'photoDisplay'];
    dataSource: Robot[] = [];
    displayedDataSource = new MatTableDataSource<Robot>([]);
    images: Map<string, {base64?: string, type?: string}> = new Map();

    filter: string = "";
    searchBarTimeout: NodeJS.Timeout;

    public isLoading$ = new BehaviorSubject<boolean>(false);
    private endCursor$ = new BehaviorSubject<Robot | null>(null);
    public hasMoreData$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();
    public selection = new SelectionModel<Robot>(true, []);
    private categories$ = new BehaviorSubject<Map<string, Category>>(null);

    private readonly NAME_COLUMN_INDEX = 2;
    private readonly PHOTO_COLUMN_INDEX = 6;
    private readonly CATEGORY_COLUMN_INDEX = 3;

    readonly searchBarPlaceholder = "Buscar Robots por Nombre";

    constructor(private asimovService: AsimovService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private modalService: MDBModalService
    ) { }

    ngOnInit(): void {
        this.asimovService.getRobots().subscribe(robots => {
            this.dataSource = robots;
            this.applyFilters();
            this.dataSource.forEach((robot: Robot) => {this.images.set(robot.id, {base64: null, type: null})});
        });
        this.asimovService.getCategories().subscribe(categories => {
            let nextValue = new Map<string, Category>;
            categories.forEach(category => nextValue.set(category.name.toLowerCase(), category));
            this.categories$.next(nextValue);
        });
    }

    handleSearchbarEvent(e: any) {
        if(this.searchBarTimeout) clearTimeout(this.searchBarTimeout);
        this.searchBarTimeout = setTimeout(() => {
            this.filter = e.target.value.trim();
            this.applyFilters();
        }, 1000)
    }

    private waitingForPictureData(pictureData: {base64?: string, type?: string}) {
        return (!pictureData.base64 && pictureData.type) || (!pictureData.type && pictureData.base64);
    }

    updateRobotPic(robot: Robot) {
        const pictureData = this.images.get(robot.id);
        if(this.waitingForPictureData(pictureData)) return;
        this.asimovService.updateRobotPic(robot, this.images).subscribe(newURL => {
            robot.photo = newURL;
            this.asimovService.updateRobot(robot).subscribe(updated => {
                if(!updated) {
                    console.error('Error updating robot photo');
                }
            });
        });
    }

    private applyFilters() {
        this.displayedDataSource.data = this.dataSource.filter(robot => {
            return robot.name.toLowerCase().includes(this.filter.toLowerCase());
        });
    }

    addRobots(robots: Robot[]) {
        this.asimovService.addRobots(robots).subscribe({
            next: addedRobots => {
                this.dataSource = this.dataSource.concat(this.dataSource, addedRobots);
                this.dataSource.forEach((robot) => {this.images.set(robot.id, {base64: null, type: null})});
                this.applyFilters();
            },
            error: error => {
                console.log(error);
            }
        });
    }

    addRobot(robot: Robot) {
        this.asimovService.addRobot(robot).subscribe({
            next: addedRobot => {
                this.dataSource.push(addedRobot);
                this.images.set(addedRobot.id, {base64: null, type: null});
                this.applyFilters();
            },
            error: error => {
                console.log(error);
            }
        });
    }

    deleteRobots(): void {
        this.isLoading$.next(true);

        const robotsToDelete = this.selection.selected;

        this.asimovService.deleteRobots(robotsToDelete).pipe(
            tap(() => this.isLoading$.next(false)),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (deletedSuccessfully) => {
                if (deletedSuccessfully) {
                    const currentData = this.dataSource;
                    this.dataSource = currentData.filter(robot =>
                        !robotsToDelete.some(deletedRobot => deletedRobot.id === robot.id)
                    );

                    this.selection.clear();

                    this.snackBar.open(`${robotsToDelete.length} robot${robotsToDelete.length > 1 ? 's' : ''} deleted successfully!`, 'Close', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.applyFilters();
                } else {
                    this.snackBar.open('Deletion failed or partially completed. Please check server logs.', 'Dismiss', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                }
            },
            error: (error) => {
                console.error('Error deleting robots:', error);
                this.snackBar.open('Failed to delete robots. Please try again.', 'Dismiss', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });
                this.isLoading$.next(false);
            }
        });
    }

    private csvToRobot(parsedCsvRow: any): Robot {
        const category = this.categories$.getValue().get(parsedCsvRow[this.CATEGORY_COLUMN_INDEX].trim().toLowerCase());
        if(!category)
            throw new Error(`Category ${parsedCsvRow[this.CATEGORY_COLUMN_INDEX]} for Robot ${parsedCsvRow[this.NAME_COLUMN_INDEX]} not found`);
        const catId = category.id;
        return {
            // uId will be set inside the service
            id: "",
            name: parsedCsvRow[this.NAME_COLUMN_INDEX],
            photo: parsedCsvRow[this.PHOTO_COLUMN_INDEX],
            category: {name: parsedCsvRow[this.CATEGORY_COLUMN_INDEX], id: catId},
        } as Robot;
    }

    onCsvFileParsed(parsedRobotData: any[]) {
        try {
            const formattedRobotData: Robot[] = parsedRobotData.map(robot => {
                return this.csvToRobot(robot);
            });
            this.addRobots(formattedRobotData);
        } catch(error) {
            this.modalService.show(AlertModalComponent, {
                data: {
                    message: error,
                    type: "error"
                },
                class: 'modal-dialog-centered',
            });
        }
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.displayedDataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.displayedDataSource.data.forEach(row => this.selection.select(row));
    }

    openAddRobotDialog(): void {
        const categories: Category[] = [];
        for(let category of this.categories$.getValue().values()) { categories.push(category); }
        const dialogRef = this.dialog.open(RobotFormDialogComponent, {
            width: '600px',
            data: { title: 'Add New Robot', categories: categories }
        });

        dialogRef.afterClosed().subscribe((newData) => {
            if (newData) {
                this.addRobot(newData);
            } else {
                this.snackBar.open('Robot creation cancelled.', 'Dismiss', { duration: 2000 });
            }
        });
    }
}
