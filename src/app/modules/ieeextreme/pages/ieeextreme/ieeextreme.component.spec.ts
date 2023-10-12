import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IeeextremeComponent } from './ieeextreme.component';

describe('IeeextremeComponent', () => {
    let component: IeeextremeComponent;
    let fixture: ComponentFixture<IeeextremeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ IeeextremeComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IeeextremeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
