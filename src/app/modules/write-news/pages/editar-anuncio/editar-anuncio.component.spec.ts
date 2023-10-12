import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAnuncioComponent } from './editar-anuncio.component';

describe('EditarAnuncioComponent', () => {
    let component: EditarAnuncioComponent;
    let fixture: ComponentFixture<EditarAnuncioComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ EditarAnuncioComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditarAnuncioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
