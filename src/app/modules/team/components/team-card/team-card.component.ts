// Para usar este componente solo hay que inputearle el type que puede ser cualquiera de las categorias y eso te carga el array con datos de esa categoria

import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../../../shared/models/person/person';

@Component({
  selector: 'app-team-card',
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent implements OnInit {
  white: boolean = false;
  people: Person[];

  // Constants

  // Actual

  peopleCD_actual = [
    new Person("Pedro Hernán García", "https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg", "https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4", "pegarcia@itba.edu.ar", 'HOME.CARGO.CD.PRESIDENT'),    
    new Person("Francisco Basili", "https://i.ibb.co/YX5j6nw/arielnowik.jpg", "https://www.linkedin.com/in/francisco-basili-0a38821b4/", "fbasili@itba.edu.ar", 'HOME.CARGO.CD.VP'),
    new Person("Olivia de Vincenti", "https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg", "https://www.linkedin.com/in/olivia-de-vincenti/", "odevincenti@itba.edu.ar", 'HOME.CARGO.CD.OPANDGENSEC'),
    new Person("Xi Lin", "https://i.ibb.co/7zYkGtG/xilin.jpg", "https://www.linkedin.com/in/xi-lin-0945951a0/", "xlin@itba.edu.ar", 'HOME.CARGO.CD.TREASURER'),
  ];

  peopleMediacom_actual = [
    new Person("Martina Mattias Raposo", "https://i.ibb.co/5rf7cSJ/alexmoldovan.jpg", "https://www.linkedin.com/in/martinamattiasraposo/", "cmattias@itba.edu.ar", 'HOME.CARGO.MEDIACOM.DIRECTOR'),
    new Person("Lucas Catolino", "https://i.ibb.co/yRK2dP2/Lucas-Catolino.jpg", "https://www.linkedin.com/in/lucas-catolino-431b52167/", "lcatolino@itba.edu.ar", 'HOME.CARGO.MEDIACOM.DIRECTOR_AND_WRITER'),
    new Person("Abril Herrlein", "https://i.ibb.co/vdph6YM/Sof-a-Altman.jpg", "linkedin.com/AbrilHerrlein", "aherrlein@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CM'),
  ]

  peopleMediacom2_actual = [
    new Person("Julieta Gagliardi ", "https://i.ibb.co/g429zc7/nicolebartellini.jpg", "https://www.linkedin.com/in/julieta-gagliardi-aa7406157", "jgagliardi@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CM'),
    new Person("Clara Muruzábal", "https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg", "https://www.linkedin.com/mwlite/in/clara-muruzabal-5976301b8", "cmuruzabal@itba.edu.ar", 'HOME.CARGO.MEDIACOM.CM'),
    new Person("Nicolas Matias Margenat", "https://i.ibb.co/GHc1nZx/V-ctor-Oh.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-margenat-018291208", "nmargenat@itba.edu.ar", "HOME.CARGO.MEDIACOM.WRITER")
  ];

  peopleMediacom3_actual = [
    new Person("Victor Oh", "https://i.ibb.co/GHc1nZx/V-ctor-Oh.jpg", "https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar", "voh@itba.edu.ar", "HOME.CARGO.MEDIACOM.WRITER"),
    new Person("Juan Bautista Capristo", "https://i.ibb.co/g429zc7/nicolebartellini.jpg", "https://www.linkedin.com/in/juanbautistacapristo/", "jcapristo@itba.edu.ar", 'HOME.CARGO.MEDIACOM.ILUSTRATOR'),
    new Person("Alexander Stephan Moldovan Loayza", "https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg", "linkedin.com/in/alexander-moldovan-a22842145", "amoldovan@itba.edu.ar", 'HOME.CARGO.MEDIACOM.ILUSTRATOR')
  ];

  peopleID_actual = [
    new Person("María Candelaria Ruiz Casas", "https://i.ibb.co/zfT818s/candelariaruiz.jpg", "http://linkedin.com/in/maría-candelaria-ruiz-casas", "mariruiz@itba.edu.ar", 'HOME.CARGO.ID.CHIEF'),
    new Person("Damián Ezequiel Sergi", "https://i.ibb.co/8B973Hk/alanmechoulam.jpg", "https://www.linkedin.com/in/dami%C3%A1n-ezequiel-sergi-0141ba168/", "dsergi@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER'),
    new Person("Santiago Sandrini", "https://i.ibb.co/0JtCzJj/Juan-Martin-Mujica-Buj.jpg", "https://www.linkedin.com/in/santiago-sandrini-ab543b219", "ssandrini@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER'),
    new Person("Manuel Dizenhaus", "https://i.ibb.co/31vBrMv/Dante-Kienigiel.jpg", "www.linkedin.com/in/manuel-dizenhaus", "mdizenhaus@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER')
  ];

  peopleID_actual_2 = [
    new Person("Fernanda Belen Cattaneo", "https://i.ibb.co/zfT818s/candelariaruiz.jpg", "www.linkedin.com/in/fernanda-belen-cattaneo-itba", "fcattaneo@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER'),
    new Person("Santiago López Franceschini", "https://i.ibb.co/8B973Hk/alanmechoulam.jpg", "https://www.linkedin.com/in/santiago-l%C3%B3pez-franceschini-61761021b/", "slopezfranceschini@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER'),
    new Person("Juan Martín Mujica Buj", "https://i.ibb.co/0JtCzJj/Juan-Martin-Mujica-Buj.jpg", "https://www.linkedin.com/in/juan-mart%C3%ADn-mujica-buj-4a301b18b", "jmujica@itba.edu.ar", 'HOME.CARGO.ID.RESEARCHER'),
  ];

  peopleFundr_actual = [
    new Person("Nicolás Bustelo", "https://i.ibb.co/DKGwT2n/Nicol-s-Bustelo.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-bustelo/", "nbustelo@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.DIRECTOR'),
    new Person("Ernestina Petti", "https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg", "https://www.linkedin.com/in/olivia-de-vincenti/", "odevincenti@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Carlos Angel Chen", "https://i.ibb.co/Y2HLmTm/Carlos-Chen.jpg", "https://www.linkedin.com/in/carlos-angel-chen/", "cchen@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
  ];
  peopleFundr2_actual = [
    new Person("Martin Romano", "https://i.ibb.co/L6bmm4y/Martin-Romano.jpg", "https://www.linkedin.com/in/martin-romano-ba9351203/", "marromano@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Manuel Machado", "https://i.ibb.co/Lk5rRvG/Manuel-Machado.jpg", "https://www.linkedin.com/in/manuelmachado7/", "manmachado@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
    new Person("Martin Javier Romano", "https://i.ibb.co/HrqHtZV/nicolaspelayo.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/", "nifernandez@itba.edu.ar", 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
  ];

  peopleEdu_actual = [
    new Person("Pedro Hernán García", "https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg", "https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4", "pegarcia@itba.edu.ar", 'HOME.CARGO.EDUCATION.CO-DIRECTOR'),
    new Person("Francisco Basili", "https://i.ibb.co/sKw2BDC/Fran-Basili.jpg", "https://www.linkedin.com/in/francisco-basili-0a38821b4", "fbasili@itba.edu.ar", 'HOME.CARGO.EDUCATION.CO-DIRECTOR'),
    new Person("Ignacio Cutignola", "https://i.ibb.co/PZYTy7t/Ignacio-Cutignola.jpg", "https://www.linkedin.com/in/ignacio-cutignola-4a6865201/", "icutignola@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT')
  ]

  peopleEdu2_actual = [
    new Person("Matías Bergerman", "https://i.ibb.co/rvWJBCt/matiasbergerman.jpg", "https://www.linkedin.com/in/mat%C3%ADas-bergerman-a934881a5/", "mbergerman@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Agustin Lara Acosta", "https://i.ibb.co/g76mW7d/Agustin-Lara.jpg", "https://www.linkedin.com/in/agustin-lara-acosta-55075b1ab/", "alara@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
    new Person("Alejo Figueroa", "https://i.ibb.co/TTfpCN7/Alejo-Figueroa.jpg", "https://www.linkedin.com/in/alejo-agustin-figueroa-204589147/", "alfigueroa@itba.edu.ar", 'HOME.CARGO.EDUCATION.ASSISTANT'),
  ];

  peopleIT_actual = [
    new Person("Eugenia Sol Piñeiro", "https://i.ibb.co/rvw8HVm/Euge-pineiro.png", "https://www.linkedin.com/in/eugenia-piñeiro", "epineiro@itba.edu.ar", 'HOME.CARGO.IT.DIRECTOR'),
    new Person("Matías Santiago Francois", "https://i.ibb.co/6mq1FSp/Matias-Francois.jpg", "https://www.linkedin.com/in/matias-francois/", "mfrancois@itba.edu.ar", 'HOME.CARGO.IT.WEBMASTER'),
    new Person("Matias Ricarte", "https://i.ibb.co/x5rVdTb/Matias-Ricarte.jpg", "https://www.linkedin.com/in/matias-agustin-ricarte-183b271a3/", "mricarte@itba.edu.ar", 'HOME.CARGO.IT.WEBMASTER'),
  ];



  // 2021

  peopleCD_2021 = [
    new Person("Ariel Nowik", "https://i.ibb.co/YX5j6nw/arielnowik.jpg", "https://www.linkedin.com/in/ariel-nowik-13608a158/", "anowik@itba.edu.ar", 'HOME.CARGO2021.CD.PRESIDENT'),
    new Person("Olivia de Vincenti", "https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg", "https://www.linkedin.com/in/olivia-de-vincenti/", "odevincenti@itba.edu.ar", 'HOME.CARGO2021.CD.GENERALSEC'),
    new Person("Xi Lin", "https://i.ibb.co/7zYkGtG/xilin.jpg", "https://www.linkedin.com/in/xi-lin-0945951a0/", "xlin@itba.edu.ar", 'HOME.CARGO2021.CD.TREASURER'),
    new Person("Pedro Hernán García", "https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg", "https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4", "pegarcia@itba.edu.ar", 'HOME.CARGO2021.CD.VP'),
    ];

    peopleMediacom_2021 = [
      new Person("Alex Moldovan", "https://i.ibb.co/5rf7cSJ/alexmoldovan.jpg", "https://www.linkedin.com/in/alexander-moldovan-a22842145/", "amoldovan@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Agustin Gullino", "https://i.ibb.co/Pw5MkV2/Agustin-Guillino.jpg", "https://www.linkedin.com/in/agust%C3%ADn-luis-gullino-a87083197/", "agullino@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Sofia Altman", "https://i.ibb.co/vdph6YM/Sof-a-Altman.jpg", "https://www.linkedin.com/in/sofia-paula-altman-vogl-063498207/", "saltman@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Nicole Czemerinski", "https://i.ibb.co/yYczXLK/Nicole-Czemerinski.jpg", "https://www.linkedin.com/in/nicole-czemerinski-799343207/", "nczemerinski@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
    ]

    peopleMediacom2_2021 = [
      new Person("Nicole Bartellini", "https://i.ibb.co/g429zc7/nicolebartellini.jpg", "https://www.linkedin.com/in/nicole-bartellini-huapalla-a370ab1a7/", "nbartellini@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Zahira Gimenez", "https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg", "#", "zjimenez@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Lucas Catolino", "https://i.ibb.co/yRK2dP2/Lucas-Catolino.jpg", "https://www.linkedin.com/in/lucas-catolino-431b52167/", "lcatolino@itba.edu.ar", 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      new Person("Victor Oh", "https://i.ibb.co/GHc1nZx/V-ctor-Oh.jpg", "https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar", "voh@itba.edu.ar", "HOME.CARGO2021.MEDIACOM.DESIGNER")
    ];

    peopleID_2021 = [
      new Person("Candelaria Ruiz", "https://i.ibb.co/zfT818s/candelariaruiz.jpg", "https://www.linkedin.com/in/mar%C3%ADa-candelaria-ruiz-casas/", "mariruiz@itba.edu.ar", 'HOME.CARGO2021.ID.CHIEF'),
      new Person("Alan Mechoulam", "https://i.ibb.co/8B973Hk/alanmechoulam.jpg", "https://www.linkedin.com/in/alanmechoulam/", "amechoulam@itba.edu.ar", 'HOME.CARGO2021.ID.ASSISTANT'),
      new Person("Juan Martín Mujica Buj", "https://i.ibb.co/0JtCzJj/Juan-Martin-Mujica-Buj.jpg", "https://www.linkedin.com/in/juan-mart%C3%ADn-mujica-buj-4a301b18b/", "jmujica@itba.edu.ar", 'HOME.CARGO2021.ID.ASSISTANT'),
      new Person("Dante Kienigiel", "https://i.ibb.co/31vBrMv/Dante-Kienigiel.jpg", "https://www.linkedin.com/in/dante-k-572396bb/", "dkienigiel@itba.edu.ar", 'HOME.CARGO2021.ID.ASSISTANT')
    ];

    peopleFundr_2021 = [
      new Person("Xi Lin", "https://i.ibb.co/7zYkGtG/xilin.jpg", "https://www.linkedin.com/in/xi-lin-0945951a0/", "xlin@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.CO-DIRECTOR'),
      new Person("Olivia de Vincenti", "https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg", "https://www.linkedin.com/in/olivia-de-vincenti/", "odevincenti@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.CO-DIRECTOR'),
      new Person("Nicolás Pelayo", "https://i.ibb.co/HrqHtZV/nicolaspelayo.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/", "nifernandez@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
      new Person("Carlos Angel Chen", "https://i.ibb.co/Y2HLmTm/Carlos-Chen.jpg", "https://www.linkedin.com/in/carlos-angel-chen/", "cchen@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
    ];
    peopleFundr2_2021 = [
      new Person("Martin Romano", "https://i.ibb.co/L6bmm4y/Martin-Romano.jpg", "https://www.linkedin.com/in/martin-romano-ba9351203/", "marromano@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
      new Person("Nicolás Bustelo", "https://i.ibb.co/DKGwT2n/Nicol-s-Bustelo.jpg", "https://www.linkedin.com/in/nicol%C3%A1s-bustelo/", "nbustelo@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
      new Person("Manuel Machado", "https://i.ibb.co/Lk5rRvG/Manuel-Machado.jpg", "https://www.linkedin.com/in/manuelmachado7/", "manmachado@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
      new Person("Lucas Agustín Vittor", "https://i.ibb.co/3Cp0vY0/Lucas-Vittor.jpg", "https://www.linkedin.com/in/lvvittor/", "lvittor@itba.edu.ar", 'HOME.CARGO2021.FUNDRAISING.ASSISTANT')
    ];

    peopleEdu_2021 = [
      new Person("Pedro Hernán García", "https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg", "https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4", "pegarcia@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.CO-DIRECTOR'),
      new Person("Francisco Basili", "https://i.ibb.co/sKw2BDC/Fran-Basili.jpg", "https://www.linkedin.com/in/francisco-basili-0a38821b4", "fbasili@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.CO-DIRECTOR'),
      new Person("Ignacio Cutignola", "https://i.ibb.co/PZYTy7t/Ignacio-Cutignola.jpg", "https://www.linkedin.com/in/ignacio-cutignola-4a6865201/", "icutignola@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.ASSISTANT')
    ]

    peopleEdu2_2021 = [
      new Person("Matías Bergerman", "https://i.ibb.co/rvWJBCt/matiasbergerman.jpg", "https://www.linkedin.com/in/mat%C3%ADas-bergerman-a934881a5/", "mbergerman@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
      new Person("Agustin Lara Acosta", "https://i.ibb.co/g76mW7d/Agustin-Lara.jpg", "https://www.linkedin.com/in/agustin-lara-acosta-55075b1ab/", "alara@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
      new Person("Alejo Figueroa", "https://i.ibb.co/TTfpCN7/Alejo-Figueroa.jpg", "https://www.linkedin.com/in/alejo-agustin-figueroa-204589147/", "alfigueroa@itba.edu.ar", 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
    ];

    peopleIT_2021 = [
      new Person("Eugenia Sol Piñeiro", "https://i.ibb.co/rvw8HVm/Euge-pineiro.png", "https://www.linkedin.com/in/eugenia-piñeiro", "epineiro@itba.edu.ar", 'HOME.CARGO2021.IT.DIRECTOR'),
      new Person("Matías Santiago Francois", "https://i.ibb.co/6mq1FSp/Matias-Francois.jpg", "https://www.linkedin.com/in/matias-francois/", "mfrancois@itba.edu.ar", 'HOME.CARGO2021.IT.WEBMASTER'),
      new Person("Matias Ricarte", "https://i.ibb.co/x5rVdTb/Matias-Ricarte.jpg", "https://www.linkedin.com/in/matias-agustin-ricarte-183b271a3/", "mricarte@itba.edu.ar", 'HOME.CARGO2021.IT.WEBMASTER'),
    ];



  // 2020
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


  // Input

  @Input() type: string;

  constructor() { }

  // Functions

  ngOnInit(): void {
    switch (this.type) {

      // Actual

      case "CD_actual":{
        this.people = this.peopleCD_actual;
        break;
      }
      case 'Mediacom_actual': {
        this.people = this.peopleMediacom_actual;
        break;
      }
      case 'Mediacom2_actual': {
        this.people = this.peopleMediacom2_actual;
        break;
      }
      case 'Mediacom3_actual': {
        this.people = this.peopleMediacom3_actual;
        break;
      }
      case 'IT_actual': {
        this.people = this.peopleIT_actual;
        break;
      }
      case 'ID_actual': {
        this.people = this.peopleID_actual;
        break;
      }
      case 'ID_actual_2': {
        this.people = this.peopleID_actual_2;
        break;
      }
      case 'Fundraising_actual': {
        this.people = this.peopleFundr_actual;
        break;
      }
      case 'Fundraising2_actual': {
        this.people = this.peopleFundr2_actual;
        break;
      }
      case 'Education_actual': {
        this.people = this.peopleEdu_actual;
        break;
      }
      case 'Education2_actual': {
        this.people = this.peopleEdu2_actual;
        break;
      }

      // 2021

      case "CD_2021":{
        this.people = this.peopleCD_2021;
        break;
      }
      case 'Mediacom_2021': {
        this.people = this.peopleMediacom_2021;
        break;
      }
      case 'Mediacom2_2021': {
        this.people = this.peopleMediacom2_2021;
        break;
      }
      case 'IT_2021': {
        this.people = this.peopleIT_2021;
        break;
      }
      case 'ID_2021': {
        this.people = this.peopleID_2021;
        break;
      }
      case 'Fundraising_2021': {
        this.people = this.peopleFundr_2021;
        break;
      }
      case 'Fundraising2_2021': {
        this.people = this.peopleFundr2_2021;
        break;
      }
      case 'Education_2021': {
        this.people = this.peopleEdu_2021;
        break;
      }
      case 'Education2_2021': {
        this.people = this.peopleEdu2_2021;
        break;
      }



      // 2020
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
    }
  }

}
