import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { CommissionEditorModalComponent } from 'src/app/shared/components/commission-editor-modal/commission-editor-modal.component';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent {

  editPositionsMode: boolean = false;

  modalRef: MDBModalRef | null = null;

  commissions = [
    {
      id: "CD",
      title: {
        "en": "Commission Board",
        "es": "Comisión Directiva"
      },
      roles: [
        {
          id: "PRESIDENT",
          title: {
            "en": "President",
            "es": "Presidente"
          },
        },
        {
          id: "SECRETARY",
          title: {
            "en": "Secretary",
            "es": "Secretario"
          },
        },
        {
          id: "TREASURER",
          title: {
            "en": "Treasurer",
            "es": "Tesorero"
          },
        }
      ],
      order: 0,
    },
    {
      id: "MEDIA",
      title: {
        "en": "Media",
        "es": "Media"
      },
      roles: [
        {
          id: "MEDIA_DIRECTOR",
          title: {
            "en": "Media Director",
            "es": "Director de Medios"
          },
        },
        {
          id: "CONTENT_CREATOR",
          title: {
            "en": "Content Creator",
            "es": "Creador de Contenido"
          },
        },
        {
          id: "WRITER",
          title: {
            "en": "Writer",
            "es": "Escritor"
          },
        }
      ],
      order: 1,
    },
    {
      id: "IT",
      title: {
        "en": "Information Technologies",
        "es": "Tecnologías de la información"
      },
      roles: [
        {
          id: "IT_DIRECTOR",
          title: {
            "en": "IT Director",
            "es": "Director de IT"
          },
        },
        {
          id: "DEVELOPER",
          title: {
            "en": "Developer",
            "es": "Desarrollador"
          },
        }
      ],
      order: 2,
    },
    {
      id: "RAS",
      title: {
        "en": "RAS",
        "es": "RAS"
      },
      roles: [
        {
          id: "RAS_DIRECTOR",
          title: {
            "en": "RAS Director",
            "es": "Director de RAS"
          },
        },
        {
          id: "RAS_MEMBER",
          title: {
            "en": "RAS Member",
            "es": "Miembro de RAS"
          },
        }
      ],
      order: 3,
    }
  ];

  constructor(private modalService: MDBModalService) {}

  drop(event: CdkDragDrop<string[]>) {
    if (!this.editPositionsMode) return;
    moveItemInArray(this.commissions, event.previousIndex, event.currentIndex);
    this.commissions.forEach((commission, index) => {
      commission.order = index;
    });
  }

  toggleEditPositionsMode() {
    this.editPositionsMode = !this.editPositionsMode;
  }

  addCommission() {
    this.modalRef = this.modalService.show(CommissionEditorModalComponent, {
      data: {
          
      },
      class: 'modal-dialog-centered',
    });
  }
}
