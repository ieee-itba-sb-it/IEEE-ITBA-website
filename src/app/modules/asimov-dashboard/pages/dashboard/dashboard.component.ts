import { Component } from '@angular/core';
import {Encounter} from "../../../../shared/models/event/asimov/encounter";
import {Robot} from "../../../../shared/models/event/asimov/robot";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    public myRobots: Robot[] = [
        { id: 'R01', name: 'Vortex', photo: 'https://placehold.co/100x100/F44336/FFFFFF?text=V', category: { name: "heavy", id: "asd" }},
        { id: 'R02', name: 'Blade', photo: 'https://placehold.co/100x100/2196F3/FFFFFF?text=B', category: { name: "heavy", id: "asd" }},
        { id: 'R03', name: 'Hammer', photo: 'https://placehold.co/100x100/FFC107/FFFFFF?text=H', category: { name: "heavy", id: "asd" }},
        { id: 'R04', name: 'Saw', photo: 'https://placehold.co/100x100/4CAF50/FFFFFF?text=S', category: { name: "heavy", id: "asd" }},
        { id: 'R05', name: 'Crusher', photo: 'https://placehold.co/100x100/9C27B0/FFFFFF?text=C', category: { name: "heavy", id: "asd" }},
        { id: 'R06', name: 'Spike', photo: 'https://placehold.co/100x100/FF5722/FFFFFF?text=S', category: { name: "heavy", id: "asd" },},
        { id: 'R07', name: 'Titan', photo: 'https://placehold.co/100x100/607D8B/FFFFFF?text=T', category: { name: "heavy", id: "asd" },},
        { id: 'R08', name: 'Goliath', photo: 'https://placehold.co/100x100/795548/FFFFFF?text=G', category: { name: "heavy", id: "asd" },},

        // Nuevos robots para Nivel 4
        { id: 'R09', name: 'Phantom', photo: 'https://placehold.co/100x100/00BCD4/FFFFFF?text=P', category: { name: "heavy", id: "asd" },},
        { id: 'R10', name: 'Juggernaut', photo: 'https://placehold.co/100x100/8BC34A/FFFFFF?text=J', category: { name: "heavy", id: "asd" },},
        { id: 'R11', name: 'Cyclone', photo: 'https://placehold.co/100x100/E91E63/FFFFFF?text=C', category: { name: "heavy", id: "asd" }, },
        { id: 'R12', name: 'Inferno', photo: 'https://placehold.co/100x100/FF9800/FFFFFF?text=I', category: { name: "heavy", id: "asd" }, },
        { id: 'R13', name: 'Rampage', photo: 'https://placehold.co/100x100/3F51B5/FFFFFF?text=R', category: { name: "heavy", id: "asd" }, },
        { id: 'R14', name: 'Oblivion', photo: 'https://placehold.co/100x100/009688/FFFFFF?text=O', category: { name: "heavy", id: "asd" },},
        { id: 'R15', name: 'Blizzard', photo: 'https://placehold.co/100x100/CDDC39/FFFFFF?text=B', category: { name: "heavy", id: "asd" }, },
        { id: 'R16', name: 'Destructor', photo: 'https://placehold.co/100x100/673AB7/FFFFFF?text=D', category: { name: "heavy", id: "asd" }, }
    ];

    public myEncounters: Encounter[] = [
        // --- Nivel 4 (Primera ronda) ---
        { id: 'E001', level: 4, order: 0, category: { name: "heavy", id: "asd" }, robot1: 'R01', robot2: 'R02' },
        { id: 'E002', level: 4, order: 1, category: { name: "heavy", id: "asd" }, robot1: 'R03', robot2: 'R04' },
        { id: 'E003', level: 4, order: 2, category: { name: "heavy", id: "asd" }, robot1: 'R05', robot2: 'R06' },
        { id: 'E004', level: 4, order: 3, category: { name: "heavy", id: "asd" }, robot1: 'R07', robot2: 'R08' },
        { id: 'E005', level: 4, order: 4, category: { name: "heavy", id: "asd" }, robot1: 'R09', robot2: 'R10' },
        { id: 'E006', level: 4, order: 5, category: { name: "heavy", id: "asd" }, robot1: 'R11', robot2: 'R12' },
        { id: 'E007', level: 4, order: 6, category: { name: "heavy", id: "asd" }, robot1: 'R13', robot2: 'R14' },
        { id: 'E008', level: 4, order: 7, category: { name: "heavy", id: "asd" }, robot1: 'R15', robot2: 'R16' },
        { id: 'E009', level: 4, order: 8, category: { name: "heavy", id: "asd" }, robot1: 'R01', robot2: 'R02' },
        { id: 'E010', level: 4, order: 9, category: { name: "heavy", id: "asd" }, robot1: 'R03', robot2: 'R04' },
        { id: 'E011', level: 4, order: 10, category: { name: "heavy", id: "asd" }, robot1: 'R05', robot2: 'R06' },
        { id: 'E012', level: 4, order: 11, category: { name: "heavy", id: "asd" }, robot1: 'R07', robot2: 'R08' },
        { id: 'E013', level: 4, order: 12, category: { name: "heavy", id: "asd" }, robot1: 'R09', robot2: 'R10' },
        { id: 'E014', level: 4, order: 13, category: { name: "heavy", id: "asd" }, robot1: 'R11', robot2: 'R12' },
        { id: 'E015', level: 4, order: 14, category: { name: "heavy", id: "asd" }, robot1: 'R13', robot2: 'R14' },
        { id: 'E016', level: 4, order: 15, category: { name: "heavy", id: "asd" }, robot1: 'R15', robot2: 'R16' },

        // --- Nivel 3 ---
        { id: 'E017', level: 3, order: 0, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E018', level: 3, order: 1, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E019', level: 3, order: 2, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E020', level: 3, order: 3, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E021', level: 3, order: 4, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E022', level: 3, order: 5, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E023', level: 3, order: 6, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E024', level: 3, order: 7, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },

        // --- Nivel 2 (Cuartos de Final) ---
        { id: 'E025', level: 2, order: 0, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E026', level: 2, order: 1, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E027', level: 2, order: 2, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E028', level: 2, order: 3, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },

        // --- Nivel 1 (Semifinales) ---
        { id: 'E029', level: 1, order: 0, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
        { id: 'E030', level: 1, order: 1, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },

        // --- Nivel 0 (Final) ---
        { id: 'E031', level: 0, order: 0, category: { name: "heavy", id: "asd" }, robot1: '', robot2: '' },
    ];

    handleVote(votedEncounter: Encounter) {
        console.log('Se ha votado en el enfrentamiento:', votedEncounter.id);
        console.log('El ganador es el robot:', votedEncounter.winner);
        // Aquí puedes añadir la lógica para guardar el resultado en tu backend.
        // El arreglo 'myEncounters' ya está actualizado por referencia,
        // pero si usaras una estrategia OnPush necesitarías crear una nueva referencia.
    }
}
