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

export const ROBOT_DATA: Robot[] = [
    {
        id: 'R001',
        name: 'Optimus Prime',
        photo: 'https://example.com/optimus.jpg',
        category: { id: 'C001', name: 'Líder' },
        team: 'Autobots'
    },
    {
        id: 'R002',
        name: 'Bumblebee',
        photo: 'https://example.com/bumblebee.jpg',
        category: { id: 'C002', name: 'Explorador' },
        team: 'Autobots'
    },
    {
        id: 'R003',
        name: 'Megatron',
        photo: 'https://example.com/megatron.jpg',
        category: { id: 'C001', name: 'Líder' },
        team: 'Decepticons'
    },
    {
        id: 'R004',
        name: 'Starscream',
        photo: 'https://example.com/starscream.jpg',
        category: { id: 'C003', name: 'Comandante Aéreo' },
        team: 'Decepticons'
    },
    {
        id: 'R005',
        name: 'Ironhide',
        photo: 'https://example.com/ironhide.jpg',
        category: { id: 'C004', name: 'Guerrero' },
        team: 'Autobots'
    },
    {
        id: 'R006',
        name: 'Soundwave',
        photo: 'https://example.com/soundwave.jpg',
        category: { id: 'C005', name: 'Comunicador' },
        team: 'Decepticons'
    },
    {
        id: 'R007',
        name: 'Jazz',
        photo: 'https://example.com/jazz.jpg',
        category: { id: 'C002', name: 'Explorador' },
        team: 'Autobots'
    },
    {
        id: 'R008',
        name: 'Shockwave',
        photo: 'https://example.com/shockwave.jpg',
        category: { id: 'C006', name: 'Científico' },
        team: 'Decepticons'
    },
    {
        id: 'R009',
        name: 'Ratchet',
        photo: 'https://example.com/ratchet.jpg',
        category: { id: 'C007', name: 'Médico' },
        team: 'Autobots'
    },
    {
        id: 'R010',
        name: 'Devastator',
        photo: 'https://example.com/devastator.jpg',
        category: { id: 'C008', name: 'Combinador' },
        team: 'Decepticons'
    },
    {
        id: 'R011',
        name: 'Prowl',
        photo: 'https://example.com/prowl.jpg',
        category: { id: 'C009', name: 'Estratega' },
        team: 'Autobots'
    },
    {
        id: 'R012',
        name: 'Galvatron',
        photo: 'https://example.com/galvatron.jpg',
        category: { id: 'C001', name: 'Líder' },
        team: 'Decepticons'
    },
    {
        id: 'R013',
        name: 'Grimlock',
        photo: 'https://example.com/grimlock.jpg',
        category: { id: 'C010', name: 'Dinobot' },
        team: 'Autobots'
    },
    {
        id: 'R014',
        name: 'Cyclonus',
        photo: 'https://example.com/cyclonus.jpg',
        category: { id: 'C003', name: 'Comandante Aéreo' },
        team: 'Decepticons'
    },
    {
        id: 'R015',
        name: 'Hot Rod',
        photo: 'https://example.com/hotrod.jpg',
        category: { id: 'C011', name: 'Joven Guerrero' },
        team: 'Autobots'
    },
    {
        id: 'R016',
        name: 'Arcee',
        photo: 'https://example.com/arcee.jpg',
        category: { id: 'C002', name: 'Explorador' },
        team: 'Autobots'
    },
    {
        id: 'R017',
        name: 'Blurr',
        photo: 'https://example.com/blurr.jpg',
        category: { id: 'C012', name: 'Mensajero Rápido' },
        team: 'Autobots'
    },
    {
        id: 'R018',
        name: 'Scourge',
        photo: 'https://example.com/scourge.jpg',
        category: { id: 'C004', name: 'Guerrero' },
        team: 'Decepticons'
    },
    {
        id: 'R019',
        name: 'Wheeljack',
        photo: 'https://example.com/wheeljack.jpg',
        category: { id: 'C006', name: 'Científico' },
        team: 'Autobots'
    },
    {
        id: 'R020',
        name: 'Rumble',
        photo: 'https://example.com/rumble.jpg',
        category: { id: 'C005', name: 'Comunicador' },
        team: 'Decepticons'
    }
];

@Component({
    selector: 'app-robot-manager',
    templateUrl: './robot-manager.component.html',
    styleUrls: ['./robot-manager.component.css']
})
export class RobotManagerComponent implements OnInit, AfterViewInit {
    displayedColumns = ['selected', 'id', 'name', 'category', 'team'];
    dataSource = new MatTableDataSource<Robot>([]);

    public isLoading$ = new BehaviorSubject<boolean>(false);
    private endCursor$ = new BehaviorSubject<Robot | null>(null);
    public hasMoreData$ = new BehaviorSubject<boolean>(true);
    private destroy$ = new Subject<void>();
    public selection = new SelectionModel<Robot>(true, []);

    @ViewChild(CdkScrollable) scrollable: CdkScrollable;

    constructor(private asimovService: AsimovService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.loadData();
    }

    ngAfterViewInit(): void {
        if (this.scrollable) {
            this.scrollable.elementScrolled()
                .pipe(
                    debounceTime(200),
                    filter(() => !this.isLoading$.getValue() && this.hasMoreData$.getValue()),
                    takeUntil(this.destroy$))
                .subscribe(() => {
                    const viewport = this.scrollable.getElementRef().nativeElement;

                    const threshold = 400;
                    if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - threshold) {
                        this.loadData();
                    }
                });
        }
    }

    loadData(): void {
        if(this.isLoading$.getValue() || !this.hasMoreData$.getValue()) {
            return;
        }
        this.isLoading$.next(true);
        let obs: Observable<Robot[]>
        if(this.endCursor$.getValue()) {
            obs = this.asimovService.getRobotsNextPage(this.endCursor$.getValue())
        } else {
            obs = this.asimovService.getRobotsFirstPage()
        }
        obs.subscribe({
            next: robots => {
                if (robots.length > 0) {
                    this.dataSource.data = this.dataSource.data.concat(robots);
                    this.endCursor$.next(this.dataSource.data[this.dataSource.data.length - 1]);
                } else {
                    this.hasMoreData$.next(false);
                }
            },
            error: error => {
                console.log(error);
            }
        });
        this.isLoading$.next(false);
    }

    addRobots(robots: Robot[]) {
        this.asimovService.addRobots(robots).subscribe({
            next: addedRobots => {
                this.dataSource.data = this.dataSource.data.concat(this.dataSource.data, addedRobots);
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
                    const currentData = this.dataSource.data;
                    this.dataSource.data = currentData.filter(robot =>
                        !robotsToDelete.some(deletedRobot => deletedRobot.id === robot.id)
                    );

                    this.selection.clear();

                    this.snackBar.open(`${robotsToDelete.length} robot${robotsToDelete.length > 1 ? 's' : ''} deleted successfully!`, 'Close', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
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

    addRobot(robot: Robot) {
        this.asimovService.addRobot(robot).subscribe({
            next: addedRobot => {
                this.dataSource.data = this.dataSource.data.concat(this.dataSource.data, [addedRobot]);
            },
            error: error => {
                console.log(error);
            }
        });
    }

    // TODO: When given the proper form, adjust this!
    onCsvFileParsed(parsedRobotData: any[]) {
        const formattedRobotData: Robot[] = parsedRobotData.map(robot => {
            return {
                id: robot.id, name: robot.name,
                photo: robot.photo, category: { id: robot.categoryId, name: robot.categoryName },
                team: robot.team
            };
        });
        this.addRobots(formattedRobotData);
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    openAddRobotDialog(): void {
        const dialogRef = this.dialog.open(RobotFormDialogComponent, {
            width: '600px',
            data: { title: 'Add New Robot' }
        });

        dialogRef.afterClosed().subscribe((newRobotData: Robot | null) => {
            if (newRobotData) {
                this.addRobot(newRobotData);
            } else {
                this.snackBar.open('Robot creation cancelled.', 'Dismiss', { duration: 2000 });
            }
        });
    }
}
