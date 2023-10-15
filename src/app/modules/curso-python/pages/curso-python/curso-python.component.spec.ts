import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoPythonComponent } from './curso-python.component';

describe('CursoPythonComponent', () => {
    let component: CursoPythonComponent;
    let fixture: ComponentFixture<CursoPythonComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CursoPythonComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CursoPythonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
