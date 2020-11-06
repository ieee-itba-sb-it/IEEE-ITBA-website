// Para usar este componente solo hay que inputearle el type que puede ser cualquiera de las categorias y eso te carga el array con datos de esa categoria

import { Component, OnInit, Input } from '@angular/core';
import { Person } from './person';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {

  people: Person[];

  // Constants

  peopleCD = [
    new Person("Ariel Nowik", "https://i.ibb.co/YX5j6nw/arielnowik.jpg", "https://www.linkedin.com/in/ariel-nowik-13608a158/", "anowik@itba.edu.ar", 'HOME.CARGO.CD.PRESIDENT'),
    new Person("Dante Kienigiel", "https://i.ibb.co/Z2YjBfn/dantekienigiel.jpg", "https://www.linkedin.com/in/dante-k-572396bb/", "dkienigiel@itba.edu.ar", 'HOME.CARGO.CD.VP'),
    new Person("Franco Moriconi", "https://i.ibb.co/D7JsB7Q/francomoriconi.jpg", "https://www.linkedin.com/in/franco-moriconi-0002a0196/", "fmoriconi@itba.edu.ar", 'HOME.CARGO.CD.TREASURER'),
    new Person("Guillermina Gargiulo", "https://i.ibb.co/LJwn3RF/Guille-Gargiulo.png", "https://www.linkedin.com/in/guillermina-gargiulo-0677181b0/", "ggargiulo@itba.edu.ar", 'HOME.CARGO.CD.GENERALSEC')
  ];

  peopleMediacom = [
    new Person("Lucas Vidmar", "https://i.ibb.co/8P3trjg/lucasvidmar.jpg", "https://www.linkedin.com/in/lucasvidmar/", "lvidmar@itba.edu.ar", 'HOME.CARGO.MEDIACOM.WEBMASTER'),
    new Person("Eugenia Sol Piñeiro", "https://i.ibb.co/rvw8HVm/Euge-pineiro.png", "https://www.linkedin.com/in/eugenia-piñeiro", "epineiro@itba.edu.ar", 'HOME.CARGO.MEDIACOM.WEBMASTER'),
    new Person("Alex Moldovan", "https://i.ibb.co/5rf7cSJ/alexmoldovan.jpg", "#", "amoldovan@itba.edu.ar", 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
    new Person("Sofia Petrozzino", "https://i.ibb.co/1RMpjj0/sofiapetrozzino.jpg", "https://www.linkedin.com/in/sof%C3%ADa-petrozzino-22406a177/", "spetrozzino@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CC'),
    new Person("Aldana Bruno", "https://i.ibb.co/fMNMQHf/aldanabruno.jpg", "https://www.linkedin.com/in/aldana-bruno-5631a1177/", "abruno@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CC')
  ]

  peopleMediacom2 = [
    new Person("Nicole Bartellini", "https://i.ibb.co/g429zc7/nicolebartellini.jpg", "#", "nbartellini@itba.edu.ar", 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
    new Person("Barbara Zoani", "https://i.ibb.co/9gn333L/Barbara-Zaoni.png", "https://www.linkedin.com/in/barbara-zoani-gray-7070111b0", "bzoani@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CC'),
    new Person("Zahira Gimenez", "https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg", "#", "zjimenez@itba.edu.ar", 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
    new Person("Agustin Gullino", "https://i.ibb.co/RT0twqX/Agustin-Guillino.jpg", "https://www.linkedin.com/in/agust%C3%ADn-luis-gullino-a87083197/", "agullino@itba.edu.ar", 'HOME.CARGO.MEDIACOM.REDACTOR'),
    new Person("Lucas Catolino", "https://i.ibb.co/yRK2dP2/Lucas-Catolino.jpg", "https://www.linkedin.com/in/lucas-catolino-431b52167/", "lcatolino@itba.edu.ar", 'HOME.CARGO.MEDIACOM.REDACTOR'),
    new Person("Victor Oh", "https://i.ibb.co/6wnfd4v/Victor-Oh.jpg", "https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar", "voh@itba.edu.ar", "HOME.CARGO.MEDIACOM.REDACTOR")
  ];

  peopleID = [
    new Person("Alan Mechoulam", "https://i.ibb.co/8B973Hk/alanmechoulam.jpg", "https://www.linkedin.com/in/alanmechoulam/", "amechoulam@itba.edu.ar", 'HOME.CARGO.ID.CHIEF'),
    new Person("Candelaria Ruiz", "https://i.ibb.co/zfT818s/candelariaruiz.jpg", "https://www.linkedin.com/in/mar%C3%ADa-candelaria-ruiz-casas/", "mariruiz@itba.edu.ar", 'HOME.CARGO.ID.ASSISTANT'),
    new Person("Nicolás Trozzo", "https://i.ibb.co/zHmgvX5/nicolastrozzo.jpg", "https://www.linkedin.com/in/rafael-nicolas-trozzo-b13877170/", "rtrozzo@itba.edu.ar", 'HOME.CARGO.ID.ASSISTANT'),
    new Person("Juan Causse", "https://i.ibb.co/QmVxzFT/juancausse.jpg", "https://www.linkedin.com/in/juan-ignacio-causse-a01038158/", "jcausse@itba.edu.ar", 'HOME.CARGO.ID.ASSISTANT')
  ];

  peopleFundr = [
    new Person("Xi Lin", "https://i.ibb.co/7zYkGtG/xilin.jpg", "https://www.linkedin.com/in/xi-lin-0945951a0/", "xlin@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.RRPP'),
    new Person("Olivia de Vincenti", "https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg", "#", "odevincenti@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Nicolás Pelayo", "https://i.ibb.co/HrqHtZV/nicolaspelayo.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/", "nifernandez@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Carlos Angel Chen", "https://i.ibb.co/Y2HLmTm/Carlos-Chen.jpg", "https://www.linkedin.com/in/carlos-angel-chen/", "cchen@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Lucas Agustín Vittor", "https://i.ibb.co/3Cp0vY0/Lucas-Vittor.jpg", "https://www.linkedin.com/in/lvvittor/", "lvittor@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS')
  ];

  peopleEdu = [
    new Person("Pedro Hernán García", "https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg", "https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4", "pegarcia@itba.edu.ar", 'HOME.CARGO.EDUCATION.HEADTUTOR'),
    new Person("Matías Bergerman", "https://i.ibb.co/rvWJBCt/matiasbergerman.jpg", "https://www.linkedin.com/in/mat%C3%ADas-bergerman-a934881a5/", "mbergerman@itba.edu.ar", 'HOME.CARGO.EDUCATION.HEADTUTOR'),
    new Person("Francisco Ledesma", "https://i.ibb.co/TvSzk6n/franciscoledesma.jpg", "https://www.linkedin.com/in/francisco-daniel-ledesma-07182a179/", "fledesma@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Patricio Whittingslow", "https://i.ibb.co/JkCmGXZ/patriciowhittingslow.jpg", "https://www.linkedin.com/in/patricio-whittingslow-3b9564140/", "pwhittingslow@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT')
  ]

  peopleEdu2 = [
    new Person("Francisco Basili", "https://i.ibb.co/sKw2BDC/Fran-Basili.jpg", "https://www.linkedin.com/in/francisco-basili-0a38821b4", "fbasili@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Matías Sebastian Baiges", "https://i.ibb.co/cvdfKQ7/oznor-TO-soft.jpg", "https://www.linkedin.com/in/mat%C3%ADas-baiges-115bb21b4/", "mbaiges@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Agustin Lara Acosta", "https://i.ibb.co/g76mW7d/Agustin-Lara.jpg", "https://www.linkedin.com/in/agustin-lara-acosta-55075b1ab/", "alara@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Leandro Ezequiel Rodriguez", "https://i.ibb.co/tbBkxyH/Ezequiel-Rodriguez.jpg", "https://www.linkedin.com/in/ezequiel-rodriguez-87484917b/", "learodriguez@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT')
  ];


  peopleWIE = [
    new Person("Malu Stewart Harris", "https://i.ibb.co/Fwd34CH/MariaLuz.jpg", "#", "mastewart@itba.edu.ar", 'HOME.CARGO.WIE.PRESIDENT'),
    new Person("Elisabet del Pilar Crespo", "https://i.ibb.co/YB7N3hp/d-with-VSCO-with-dog1-preset.jpg", "https://www.linkedin.com/in/elisabet-del-pilar-crespo/", "ecrespo@itba.edu.ar", 'HOME.CARGO.WIE.VP'),
    new Person("Catalina Lucena Maguire", "https://i.ibb.co/m5LWTL8/Catalena-Lucena.jpg", "https://www.linkedin.com/in/catalina-lucena-maguire-322033169/", "clucena@itba.edu.ar", 'HOME.CARGO.WIE.TREASURER'),
    new Person("Sofia Petrozzino", "https://i.ibb.co/1RMpjj0/sofiapetrozzino.jpg", "https://www.linkedin.com/in/sof%C3%ADa-petrozzino-22406a177/", "spetrozzino@itba.edu.ar", 'HOME.CARGO.WIE.COMM'),
    new Person("Sofia Cerretini", "https://i.ibb.co/JmVtNQ8/sofia-cerritini.jpg", "http://linkedin.com/in/sofia-cerretini-2452691a5/", "scerretini@itba.edu.ar", 'HOME.CARGO.WIE.PLANNING')
  ];

  peopleWIErow2 = [
    new Person("Aldana Bruno", "https://i.ibb.co/fMNMQHf/aldanabruno.jpg", "https://www.linkedin.com/in/aldana-bruno-5631a1177/", "abruno@itba.edu.ar", 'HOME.CARGO.WIE.COMM'),
    new Person("Patricio Whittingslow", "https://i.ibb.co/JkCmGXZ/patriciowhittingslow.jpg", "https://www.linkedin.com/in/patricio-whittingslow-3b9564140/", "pwhittingslow@itba.edu.ar", 'HOME.CARGO.WIE.VOLUNTEER'),
    new Person("Ariel Nowik", "https://i.ibb.co/YX5j6nw/arielnowik.jpg", "https://www.linkedin.com/in/ariel-nowik-13608a158/", "anowik@itba.edu.ar", 'HOME.CARGO.WIE.VOLUNTEER'),
    new Person("Candelaria Ruiz", "https://i.ibb.co/zfT818s/candelariaruiz.jpg", "https://www.linkedin.com/in/mar%C3%ADa-candelaria-ruiz-casas/", "mariruiz@itba.edu.ar", 'HOME.CARGO.WIE.FEMVOLUNTEER')
  ];

  peopleWIErow3 = [
    new Person("Carola Pedrosa", "https://i.ibb.co/K9SbCTJ/carolapedrosa.jpg", "https://www.linkedin.com/in/carola-pedrosa-87342b1a3/", "cpedrosa@itba.edu.ar", 'HOME.CARGO.WIE.FEMVOLUNTEER'),
    new Person("Paula Oseroff", "https://i.ibb.co/MgBJDmG/paula-oseroff.png", "http://linkedin.com/in/paula-oseroff-44a0a2189", "poseroff@itba.edu.ar", 'HOME.CARGO.WIE.WEBMASTER'),
    new Person("Lucía Malfetana", "https://i.ibb.co/JyghYss/Luc-a-Malfetana.jpg", "http://linkedin.com/in/luc%C3%ADa-m-61801a1a8", "lmalfetana@itba.edu.ar", 'HOME.CARGO.WIE.SOCIAL'),
    new Person("Tamara Raquel Canillas", "https://i.ibb.co/jgKsQ0Q/Tamara-Raquel-Canillas.jpg", "https://www.linkedin.com/in/tamaracanillas", "tcanillas@itba.edu.ar", 'HOME.CARGO.WIE.FEMVOLUNTEER')
  ];

  peopleCS = [
    new Person("Ignacio Villanueva", "https://i.ibb.co/s2TtgHv/fbt.jpg", "https://www.linkedin.com/in/ignacio-villanueva-256541176/", "ivillanueva@itba.edu.ar", 'HOME.CARGO.CS.PRESIDENT'),
    new Person("Gonzalo Hirsch", "https://i.ibb.co/tZ0ZyY3/gonzalohirsch.jpg", "https://ar.linkedin.com/in/gonzalo-hirsch-5b4854155/", "ghirsch@itba.edu.ar", 'HOME.CARGO.CS.VP'),
    new Person("Catalina Lucena Maguire", "https://i.ibb.co/m5LWTL8/Catalena-Lucena.jpg", "https://www.linkedin.com/in/catalina-lucena-maguire-322033169/", "clucena@itba.edu.ar", 'HOME.CARGO.WIE.TREASURER'),
    new Person("Uriel Mijura", "https://i.ibb.co/vX8kHb0/Uriel-Mijura.jpg", "#", "umihura@itba.edu.ar", 'HOME.CARGO.CS.GENERALSEC'),
    new Person("Malu Stewart Harris", "https://i.ibb.co/Fwd34CH/MariaLuz.jpg", "#", "mastewart@itba.edu.ar", 'HOME.CARGO.CS.COMPETITIVEPROGRAMMING')
  ];

  peopleCSrow2 = [
    new Person("Julián Matías Vuoso", "https://i.ibb.co/dL2XYfF/Juli-Vuoso.jpg", "https://www.linkedin.com/in/julian-vuoso-425788192/", "juvuoso@itba.edu.ar", 'HOME.CARGO.CS.RRPP'),
    new Person("Juan Gabriel Griggio", "https://i.ibb.co/7JRcVw0/grigio.jpg", "https://ar.linkedin.com/in/juan-gabriel-griggio-816823198/", "jgriggio@itba.edu.ar", 'HOME.CARGO.CS.LOGISTIC'),
    new Person("Ignacio Alberto Méndez", "https://i.ibb.co/G998BW4/alvaro-mendez.jpg", "https://www.linkedin.com/in/ignacio-m%C3%A9ndez-62b3b1181/", "ignmendez@itba.edu.ar", 'HOME.CARGO.CS.LOGISTIC'),
    new Person("Julián Tallar", "https://i.ibb.co/rx5NyP1/Juli-Tallar.jpg", "https://www.linkedin.com/in/juli%C3%A1n-tallar/", "jtallar@itba.edu.ar", 'HOME.CARGO.CS.LOGISTIC'),
    new Person("Florencia Petrikovich", "https://i.ibb.co/vcfqtQf/flor-petrovich.jpg", "https://www.linkedin.com/in/florencia-petrikovich-a2b3aa1a6/", "fpetrikovich@itba.edu.ar", 'HOME.CARGO.CS.LOGISTIC')
  ];

  // Input

  @Input() type: string;

  constructor() { }

  // Functions

  ngOnInit(): void {
    switch (this.type) {
      case "CD": {
        this.people = this.peopleCD;
        break;
      }
      case 'Mediacom': {
        this.people = this.peopleMediacom;
        break;
      }
      case 'Mediacom2': {
        this.people = this.peopleMediacom2;
        break;
      }
      case 'ID': {
        this.people = this.peopleID;
        break;
      }
      case 'Fundraising': {
        this.people = this.peopleFundr;
        break;
      }
      case 'Education': {
        this.people = this.peopleEdu;
        break;
      }
      case 'Education2': {
        this.people = this.peopleEdu2;
        break;
      }
      case 'WIE': {
        this.people = this.peopleWIE;
        break;
      }
      case 'WIE2': {
        this.people = this.peopleWIErow2;
        break;
      }
      case 'WIE3': {
        this.people = this.peopleWIErow3;
        break;
      }
      case 'CS': {
        this.people = this.peopleCS;
        break;
      }
      case 'CS2': {
        this.people = this.peopleCSrow2;
        break;
      }
    }
  }

}