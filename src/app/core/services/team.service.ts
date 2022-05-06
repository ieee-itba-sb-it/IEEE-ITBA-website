import { IEEEMember, TeamMember } from './../../shared/models/team-member';
import { Team } from './../../shared/models/team';
import { Injectable } from '@angular/core';
import { Commission } from 'src/app/shared/models/commission';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  CD = 'CD';
  MEDIACOM = 'MediaCom';
  ID = 'ID';
  EDUCATION = 'Educación';
  FUNDRAISING = 'Fundraising';
  IT = 'IT';

  private teamCurrent = [
    {
      name: this.CD,
      team: [
        new IEEEMember('Pedro Hernán García', 'https://i.ibb.co/5jv18Xf/Pedro-Garcia.jpg', 'https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4', 'pegarcia@itba.edu.ar', 'HOME.CARGO.CD.PRESIDENT'),
        new IEEEMember('Francisco Basili', 'https://i.ibb.co/dkHQ0S8/FRANCISCO-BASILI.jpg', 'https://www.linkedin.com/in/francisco-basili-0a38821b4/', 'fbasili@itba.edu.ar', 'HOME.CARGO.CD.VP'),
        new IEEEMember('Olivia de Vincenti', 'https://i.ibb.co/bFtPRX5/OLIVIA-DE-VINCENTI.jpg', 'https://www.linkedin.com/in/olivia-de-vincenti/', 'odevincenti@itba.edu.ar', 'HOME.CARGO.CD.OPANDGENSEC'),
        new IEEEMember('Xi Lin', 'https://i.ibb.co/D7NM0TV/xilin.jpg', 'https://www.linkedin.com/in/xi-lin-0945951a0/', 'xlin@itba.edu.ar', 'HOME.CARGO.CD.TREASURER'),
      ]
    } as Commission,
    {
      name: this.MEDIACOM,
      team: [
        new IEEEMember('Martina Mattias Raposo', 'https://i.ibb.co/Xjpfwc1/MARTINA-MATTIAS-RAPOSO.jpg', 'https://www.linkedin.com/in/martinamattiasraposo/', 'cmattias@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIRECTOR'),
        new IEEEMember('Lucas Catolino', 'https://i.ibb.co/GHQPHTq/Lucas-Catolino.jpg', 'https://www.linkedin.com/in/lucas-catolino-431b52167/', 'lcatolino@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIRECTOR_AND_WRITER'),
        new IEEEMember('Abril Herrlein', 'https://i.ibb.co/vjRvSY6/ABRIL-HERRLEIN.jpg', 'linkedin.com/AbrilHerrlein', 'aherrlein@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CM'),
        new IEEEMember('Julieta Gagliardi ', 'https://i.ibb.co/qyzQ7Xs/JULIETA-GAGLIARDI.jpg', 'https://www.linkedin.com/in/julieta-gagliardi-aa7406157', 'jgagliardi@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CM'),
        new IEEEMember('Clara Muruzábal', 'https://i.ibb.co/ZBkdH6z/Clara-Muruz-bal.jpg', 'https://www.linkedin.com/mwlite/in/clara-muruzabal-5976301b8', 'cmuruzabal@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CM'),
        new IEEEMember('Nicolas Matias Margenat', 'https://i.ibb.co/t21YqTC/NICOL-S-MAT-AS-MARGENAT.png', 'https://www.linkedin.com/in/nicol%C3%A1s-margenat-018291208', 'nmargenat@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WRITER'),
        new IEEEMember('Victor Oh', 'https://i.ibb.co/55qctvY/Victor-Christian-Oh.jpg', 'https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar', 'voh@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WRITER'),
        new IEEEMember('Juan Bautista Capristo', 'https://i.ibb.co/tb4dTbv/JUAN-BAUTISTA-CAPRISTO.jpg', 'https://www.linkedin.com/in/juanbautistacapristo/', 'jcapristo@itba.edu.ar', 'HOME.CARGO.MEDIACOM.ILUSTRATOR'),
        new IEEEMember('Alexander Stephan Moldovan Loayza', 'https://i.ibb.co/DLmg1Ms/alexmoldovan.jpg', 'linkedin.com/in/alexander-moldovan-a22842145', 'amoldovan@itba.edu.ar', 'HOME.CARGO.MEDIACOM.ILUSTRATOR'),
      ]
    } as Commission,
    {
      name: this.ID,
      team: [
        new IEEEMember('María Candelaria Ruiz Casas', 'https://i.ibb.co/7K81m8z/candelariaruiz.jpg', 'http://linkedin.com/in/maría-candelaria-ruiz-casas', 'mariruiz@itba.edu.ar', 'HOME.CARGO.ID.CHIEFA'),
        new IEEEMember('Damián Ezequiel Sergi', 'https://i.ibb.co/0Vx8n0t/DAMIAN-EZEQUIEL-SERGI.jpg', 'https://www.linkedin.com/in/dami%C3%A1n-ezequiel-sergi-0141ba168/', 'dsergi@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
        new IEEEMember('Santiago Sandrini', 'https://i.ibb.co/5cPjdPZ/SANTIAGO-SANDRINI.jpg', 'https://www.linkedin.com/in/santiago-sandrini-ab543b219', 'ssandrini@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
        new IEEEMember('Fernanda Belen Cattaneo', 'https://i.ibb.co/FqbzFLr/FERNANDA-BELEN-CATTANEO.jpg', 'www.linkedin.com/in/fernanda-belen-cattaneo-itba', 'fcattaneo@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
        new IEEEMember('Santiago López Franceschini', 'https://i.ibb.co/HV6v4yk/SANTIAGO-L-PEZ-FRANCESCHINI.jpg', 'https://www.linkedin.com/in/santiago-l%C3%B3pez-franceschini-61761021b/', 'slopezfranceschini@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
        new IEEEMember('Juan Martín Mujica Buj', 'https://i.ibb.co/vswfTGV/Juan-Martin-Mujica-Buj.jpg', 'https://www.linkedin.com/in/juan-mart%C3%ADn-mujica-buj-4a301b18b', 'jmujica@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
        new IEEEMember('Manuel Dizenhaus', 'https://i.ibb.co/R9HYkfj/MANUEL-DIZENHAUS.jpg', 'www.linkedin.com/in/manuel-dizenhaus', 'mdizenhaus@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER')
      ]
    } as Commission,
    {
      name: this.FUNDRAISING,
      team: [
        new IEEEMember('Nicolás Bustelo', 'https://i.ibb.co/xXFdLyT/Nicol-s-Bustelo.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-bustelo/', 'nbustelo@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.DIRECTOR'),
        new IEEEMember('Ernestina Petti', 'https://i.ibb.co/7JgT6gT/ERNESTINA-PETTI.jpg', 'https://www.linkedin.com/in/olivia-de-vincenti/', 'odevincenti@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Carlos Angel Chen', 'https://i.ibb.co/59DPXqY/CARLOS-CHEN.jpg', 'https://www.linkedin.com/in/carlos-angel-chen/', 'cchen@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Gaspar Maschietto', 'https://i.ibb.co/6tbcRTn/Gaspar-Maschietto.jpg', 'https://www.linkedin.com/in/gaspar-maschietto-557766123', 'gmaschietto@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Manuel Machado', 'https://i.ibb.co/jGm2LtB/Manuel-Machado.jpg', 'https://www.linkedin.com/in/manuelmachado7/', 'manmachado@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Martin Javier Romano', 'https://i.ibb.co/jL4bWhR/MARTIN-JAVIER-ROMANO.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/', 'nifernandez@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
      ]
    } as Commission,
    {
      name: this.EDUCATION,
      team: [
        new IEEEMember('Matías Bergerman', 'https://i.ibb.co/HKZQLZh/matiasbergerman.jpg', 'https://www.linkedin.com/in/mbergerman', 'mbergerman@itba.edu.ar', 'HOME.CARGO.EDUCATION.DIRECTOR'),
        new IEEEMember('Alejo Agustín Figueroa', 'https://i.ibb.co/m8cVKQZ/ALEJO-AGUSTIN-FIGUEROA.jpg', 'https://www.linkedin.com/mwlite/in/alejo-agustin-figueroa-204589147', 'alfigueroa@itba.edu.ar', 'HOME.CARGO.EDUCATION.DIRECTOR'),
        new IEEEMember('Ignacio Cutignola', 'https://i.ibb.co/89d5fGd/Ignacio-Cutignola.jpg', 'https://www.linkedin.com/in/ignacio-cutignola-4a6865201', 'icutignola@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Matías López', 'https://i.ibb.co/thMCfY9/MATIAS-ALEJANDRO-LOPEZ-MARTINEZ.jpg', 'https://www.linkedin.com/in/mat%C3%ADas-l%C3%B3pez-4532bb21a', 'matilopez@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Agustin Luis Gullino', 'https://i.ibb.co/D59rv6f/Agustin-Guillino.jpg', 'https://www.linkedin.com/in/agust%C3%ADn-luis-gullino-a87083197/', 'agullino@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Agustín Iannaccio', 'https://i.ibb.co/jH3d80n/AGUST-N-EZEQUIEL-IANNACCIO.jpg', 'https://www.linkedin.com/in/agustiniannaccio/', 'aiannaccio@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Josue Francisco Laszeski', 'https://i.ibb.co/DRRHv75/JOSUE-FRANCISCO-LASZESKI.jpg', 'https://www.linkedin.com/in/josue-francisco-laszeski-549711214/', 'jlaszeski@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Nicolás Chiffone Guarde', 'https://i.ibb.co/qJXQFqq/Nicolas-Chiffone-Guarde.jpg', 'www.linkedin.com/in/nicolas-chiffone-guarde', 'nchiffone@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
      ]
    } as Commission,
    {
      name: this.IT,
      team: [
        new IEEEMember('Matías Santiago Francois', 'https://i.ibb.co/8zmJ7G3/Matias-Francois.jpg', 'https://www.linkedin.com/in/matias-francois/', 'mfrancois@itba.edu.ar', 'HOME.CARGO.IT.DIRECTOR'),
        new IEEEMember('Matias Ricarte', 'https://i.ibb.co/pxfb2Lm/Matias-Ricarte.jpg', 'https://www.linkedin.com/in/matias-agustin-ricarte-183b271a3/', 'mricarte@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
        new IEEEMember('Nicolás Ezequiel Birsa', 'https://i.ibb.co/0t2rZ7f/NICOLAS-EZEQUIEL-BIRSA.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-ezequiel-birsa-63631a1a1/', 'nbirsa@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
        new IEEEMember('Lucas Vittor', 'https://i.ibb.co/D5zHXbp/Lucas-Vittor.jpg', 'linkedin.com/lvvittor', 'lvittor@itba.edu.ar', 'HOME.CARGO.IT.DATA'),
        new IEEEMember('Luciano Boccardi', 'https://i.ibb.co/4dpC5dx/LUCIANO-TOM-S-BOCCARDI.jpg', 'https://www.linkedin.com/in/lboccardi', 'lboccardi@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
      ]
    } as Commission,
   ];

  private team2021 = [
    {
      name: this.CD,
      team: [
        new IEEEMember('Ariel Nowik', 'https://i.ibb.co/YX5j6nw/arielnowik.jpg', 'https://www.linkedin.com/in/ariel-nowik-13608a158/', 'anowik@itba.edu.ar', 'HOME.CARGO2021.CD.PRESIDENT'),
        new IEEEMember('Olivia de Vincenti', 'https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg', 'https://www.linkedin.com/in/olivia-de-vincenti/', 'odevincenti@itba.edu.ar', 'HOME.CARGO2021.CD.GENERALSEC'),
        new IEEEMember('Xi Lin', 'https://i.ibb.co/7zYkGtG/xilin.jpg', 'https://www.linkedin.com/in/xi-lin-0945951a0/', 'xlin@itba.edu.ar', 'HOME.CARGO2021.CD.TREASURER'),
        new IEEEMember('Pedro Hernán García', 'https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg', 'https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4', 'pegarcia@itba.edu.ar', 'HOME.CARGO2021.CD.VP'),
      ]
    } as Commission,
    {
      name: this.MEDIACOM,
      team: [
        new IEEEMember('Alex Moldovan', 'https://i.ibb.co/5rf7cSJ/alexmoldovan.jpg', 'https://www.linkedin.com/in/alexander-moldovan-a22842145/', 'amoldovan@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Agustin Gullino', 'https://i.ibb.co/Pw5MkV2/Agustin-Guillino.jpg', 'https://www.linkedin.com/in/agust%C3%ADn-luis-gullino-a87083197/', 'agullino@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Sofia Altman', 'https://i.ibb.co/vdph6YM/Sof-a-Altman.jpg', 'https://www.linkedin.com/in/sofia-paula-altman-vogl-063498207/', 'saltman@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Nicole Czemerinski', 'https://i.ibb.co/yYczXLK/Nicole-Czemerinski.jpg', 'https://www.linkedin.com/in/nicole-czemerinski-799343207/', 'nczemerinski@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Nicole Bartellini', 'https://i.ibb.co/g429zc7/nicolebartellini.jpg', 'https://www.linkedin.com/in/nicole-bartellini-huapalla-a370ab1a7/', 'nbartellini@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Zahira Gimenez', 'https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg', '#', 'zjimenez@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Lucas Catolino', 'https://i.ibb.co/yRK2dP2/Lucas-Catolino.jpg', 'https://www.linkedin.com/in/lucas-catolino-431b52167/', 'lcatolino@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
        new IEEEMember('Victor Oh', 'https://i.ibb.co/GHc1nZx/V-ctor-Oh.jpg', 'https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar', 'voh@itba.edu.ar', 'HOME.CARGO2021.MEDIACOM.DESIGNER'),
      ]
    } as Commission,
    {
      name: this.ID,
      team: [
        new IEEEMember('Candelaria Ruiz', 'https://i.ibb.co/zfT818s/candelariaruiz.jpg', 'https://www.linkedin.com/in/mar%C3%ADa-candelaria-ruiz-casas/', 'mariruiz@itba.edu.ar', 'HOME.CARGO2021.ID.CHIEF'),
        new IEEEMember('Alan Mechoulam', 'https://i.ibb.co/8B973Hk/alanmechoulam.jpg', 'https://www.linkedin.com/in/alanmechoulam/', 'amechoulam@itba.edu.ar', 'HOME.CARGO2021.ID.ASSISTANT'),
        new IEEEMember('Juan Martín Mujica Buj', 'https://i.ibb.co/0JtCzJj/Juan-Martin-Mujica-Buj.jpg', 'https://www.linkedin.com/in/juan-mart%C3%ADn-mujica-buj-4a301b18b/', 'jmujica@itba.edu.ar', 'HOME.CARGO2021.ID.ASSISTANT'),
        new IEEEMember('Dante Kienigiel', 'https://i.ibb.co/31vBrMv/Dante-Kienigiel.jpg', 'https://www.linkedin.com/in/dante-k-572396bb/', 'dkienigiel@itba.edu.ar', 'HOME.CARGO2021.ID.ASSISTANT')
      ]
    } as Commission,
    {
      name: this.FUNDRAISING,
      team: [
        new IEEEMember('Xi Lin', 'https://i.ibb.co/7zYkGtG/xilin.jpg', 'https://www.linkedin.com/in/xi-lin-0945951a0/', 'xlin@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.CO-DIRECTOR'),
        new IEEEMember('Olivia de Vincenti', 'https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg', 'https://www.linkedin.com/in/olivia-de-vincenti/', 'odevincenti@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.CO-DIRECTOR'),
        new IEEEMember('Nicolás Pelayo', 'https://i.ibb.co/HrqHtZV/nicolaspelayo.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/', 'nifernandez@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
        new IEEEMember('Carlos Angel Chen', 'https://i.ibb.co/Y2HLmTm/Carlos-Chen.jpg', 'https://www.linkedin.com/in/carlos-angel-chen/', 'cchen@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
        new IEEEMember('Martin Romano', 'https://i.ibb.co/L6bmm4y/Martin-Romano.jpg', 'https://www.linkedin.com/in/martin-romano-ba9351203/', 'marromano@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
        new IEEEMember('Nicolás Bustelo', 'https://i.ibb.co/DKGwT2n/Nicol-s-Bustelo.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-bustelo/', 'nbustelo@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
        new IEEEMember('Manuel Machado', 'https://i.ibb.co/Lk5rRvG/Manuel-Machado.jpg', 'https://www.linkedin.com/in/manuelmachado7/', 'manmachado@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
        new IEEEMember('Lucas Agustín Vittor', 'https://i.ibb.co/3Cp0vY0/Lucas-Vittor.jpg', 'https://www.linkedin.com/in/lvvittor/', 'lvittor@itba.edu.ar', 'HOME.CARGO2021.FUNDRAISING.ASSISTANT'),
      ]
    } as Commission,
    {
      name: this.EDUCATION,
      team: [
        new IEEEMember('Pedro Hernán García', 'https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg', 'https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4', 'pegarcia@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.CO-DIRECTOR'),
        new IEEEMember('Francisco Basili', 'https://i.ibb.co/sKw2BDC/Fran-Basili.jpg', 'https://www.linkedin.com/in/francisco-basili-0a38821b4', 'fbasili@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.CO-DIRECTOR'),
        new IEEEMember('Ignacio Cutignola', 'https://i.ibb.co/PZYTy7t/Ignacio-Cutignola.jpg', 'https://www.linkedin.com/in/ignacio-cutignola-4a6865201/', 'icutignola@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
        new IEEEMember('Matías Bergerman', 'https://i.ibb.co/rvWJBCt/matiasbergerman.jpg', 'https://www.linkedin.com/in/mat%C3%ADas-bergerman-a934881a5/', 'mbergerman@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
        new IEEEMember('Agustin Lara Acosta', 'https://i.ibb.co/g76mW7d/Agustin-Lara.jpg', 'https://www.linkedin.com/in/agustin-lara-acosta-55075b1ab/', 'alara@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
        new IEEEMember('Alejo Figueroa', 'https://i.ibb.co/TTfpCN7/Alejo-Figueroa.jpg', 'https://www.linkedin.com/in/alejo-agustin-figueroa-204589147/', 'alfigueroa@itba.edu.ar', 'HOME.CARGO2021.EDUCATION.ASSISTANT'),
      ]
    } as Commission,
    {
      name: this.IT,
      team: [
        new IEEEMember('Eugenia Sol Piñeiro', 'https://i.ibb.co/rvw8HVm/Euge-pineiro.png', 'https://www.linkedin.com/in/eugenia-piñeiro', 'epineiro@itba.edu.ar', 'HOME.CARGO2021.IT.DIRECTOR'),
        new IEEEMember('Matías Santiago Francois', 'https://i.ibb.co/6mq1FSp/Matias-Francois.jpg', 'https://www.linkedin.com/in/matias-francois/', 'mfrancois@itba.edu.ar', 'HOME.CARGO2021.IT.WEBMASTER'),
        new IEEEMember('Matias Ricarte', 'https://i.ibb.co/x5rVdTb/Matias-Ricarte.jpg', 'https://www.linkedin.com/in/matias-agustin-ricarte-183b271a3/', 'mricarte@itba.edu.ar', 'HOME.CARGO2021.IT.WEBMASTER'),
      ]
    } as Commission,
  ];

  private team2020 = [
    {
      name: this.CD,
      team: [
        new IEEEMember('Ariel Nowik', 'https://i.ibb.co/YX5j6nw/arielnowik.jpg', 'https://www.linkedin.com/in/ariel-nowik-13608a158/', 'anowik@itba.edu.ar', 'HOME.CARGO.CD.PRESIDENT'),
        new IEEEMember('Dante Kienigiel', 'https://i.ibb.co/Z2YjBfn/dantekienigiel.jpg', 'https://www.linkedin.com/in/dante-k-572396bb/', 'dkienigiel@itba.edu.ar', 'HOME.CARGO.CD.VP'),
        new IEEEMember('Franco Moriconi', 'https://i.ibb.co/D7JsB7Q/francomoriconi.jpg', 'https://www.linkedin.com/in/franco-moriconi-0002a0196/', 'fmoriconi@itba.edu.ar', 'HOME.CARGO.CD.TREASURER'),
        new IEEEMember('Guillermina Gargiulo', 'https://i.ibb.co/LJwn3RF/Guille-Gargiulo.png', 'https://www.linkedin.com/in/guillermina-gargiulo-0677181b0/', 'ggargiulo@itba.edu.ar', 'HOME.CARGO.CD.GENERALSEC'),
      ]
    } as Commission,
    {
      name: this.MEDIACOM,
      team: [
        new IEEEMember('Lucas Vidmar', 'https://i.ibb.co/8P3trjg/lucasvidmar.jpg', 'https://www.linkedin.com/in/lucasvidmar/', 'lvidmar@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WEBMASTER'),
        new IEEEMember('Eugenia Sol Piñeiro', 'https://i.ibb.co/rvw8HVm/Euge-pineiro.png', 'https://www.linkedin.com/in/eugenia-piñeiro', 'epineiro@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WEBMASTER'),
        new IEEEMember('Alex Moldovan', 'https://i.ibb.co/5rf7cSJ/alexmoldovan.jpg', '#', 'amoldovan@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
        new IEEEMember('Sofia Petrozzino', 'https://i.ibb.co/1RMpjj0/sofiapetrozzino.jpg', 'https://www.linkedin.com/in/sof%C3%ADa-petrozzino-22406a177/', 'spetrozzino@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CC'),
        new IEEEMember('Aldana Bruno', 'https://i.ibb.co/fMNMQHf/aldanabruno.jpg', 'https://www.linkedin.com/in/aldana-bruno-5631a1177/', 'abruno@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CC'),
        new IEEEMember('Nicole Bartellini', 'https://i.ibb.co/g429zc7/nicolebartellini.jpg', '#', 'nbartellini@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
        new IEEEMember('Barbara Zoani', 'https://i.ibb.co/9gn333L/Barbara-Zaoni.png', 'https://www.linkedin.com/in/barbara-zoani-gray-7070111b0', 'bzoani@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CC'),
        new IEEEMember('Zahira Gimenez', 'https://i.ibb.co/9bg6z1K/Zahira-Gimenez.jpg', '#', 'zjimenez@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIBUJANTE'),
        new IEEEMember('Agustin Gullino', 'https://i.ibb.co/RT0twqX/Agustin-Guillino.jpg', 'https://www.linkedin.com/in/agust%C3%ADn-luis-gullino-a87083197/', 'agullino@itba.edu.ar', 'HOME.CARGO.MEDIACOM.REDACTOR'),
        new IEEEMember('Lucas Catolino', 'https://i.ibb.co/yRK2dP2/Lucas-Catolino.jpg', 'https://www.linkedin.com/in/lucas-catolino-431b52167/', 'lcatolino@itba.edu.ar', 'HOME.CARGO.MEDIACOM.REDACTOR'),
        new IEEEMember('Victor Oh', 'https://i.ibb.co/6wnfd4v/Victor-Oh.jpg', 'https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar', 'voh@itba.edu.ar', 'HOME.CARGO.MEDIACOM.REDACTOR'),
      ]
    } as Commission,
    {
      name: this.ID,
      team: [
        new IEEEMember('Alan Mechoulam', 'https://i.ibb.co/8B973Hk/alanmechoulam.jpg', 'https://www.linkedin.com/in/alanmechoulam/', 'amechoulam@itba.edu.ar', 'HOME.CARGO.ID.CHIEF'),
        new IEEEMember('Candelaria Ruiz', 'https://i.ibb.co/zfT818s/candelariaruiz.jpg', 'https://www.linkedin.com/in/mar%C3%ADa-candelaria-ruiz-casas/', 'mariruiz@itba.edu.ar', 'HOME.CARGO.ID.ASSISTANT'),
        new IEEEMember('Nicolás Trozzo', 'https://i.ibb.co/zHmgvX5/nicolastrozzo.jpg', 'https://www.linkedin.com/in/rafael-nicolas-trozzo-b13877170/', 'rtrozzo@itba.edu.ar', 'HOME.CARGO.ID.ASSISTANT'),
        new IEEEMember('Juan Causse', 'https://i.ibb.co/QmVxzFT/juancausse.jpg', 'https://www.linkedin.com/in/juan-ignacio-causse-a01038158/', 'jcausse@itba.edu.ar', 'HOME.CARGO.ID.ASSISTANT')
      ]
    } as Commission,
    {
      name: this.FUNDRAISING,
      team: [
        new IEEEMember('Xi Lin', 'https://i.ibb.co/7zYkGtG/xilin.jpg', 'https://www.linkedin.com/in/xi-lin-0945951a0/', 'xlin@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.RRPP'),
        new IEEEMember('Olivia de Vincenti', 'https://i.ibb.co/M5kk8JY/oliviadevincenti.jpg', '#', 'odevincenti@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Nicolás Pelayo', 'https://i.ibb.co/HrqHtZV/nicolaspelayo.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-fern%C3%A1ndez-pelayo-9530521a5/', 'nifernandez@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Carlos Angel Chen', 'https://i.ibb.co/Y2HLmTm/Carlos-Chen.jpg', 'https://www.linkedin.com/in/carlos-angel-chen/', 'cchen@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS'),
        new IEEEMember('Lucas Agustín Vittor', 'https://i.ibb.co/3Cp0vY0/Lucas-Vittor.jpg', 'https://www.linkedin.com/in/lvvittor/', 'lvittor@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.LOGISTICS')
      ]
    } as Commission,
    {
      name: this.EDUCATION,
      team: [
        new IEEEMember('Pedro Hernán García', 'https://i.ibb.co/dGkMqMj/Pedro-Garcia.jpg', 'https://www.linkedin.com/in/pedro-hernán-garcía-8b8b201b4', 'pegarcia@itba.edu.ar', 'HOME.CARGO.EDUCATION.HEADTUTOR'),
        new IEEEMember('Matías Bergerman', 'https://i.ibb.co/rvWJBCt/matiasbergerman.jpg', 'https://www.linkedin.com/in/mat%C3%ADas-bergerman-a934881a5/', 'mbergerman@itba.edu.ar', 'HOME.CARGO.EDUCATION.HEADTUTOR'),
        new IEEEMember('Francisco Ledesma', 'https://i.ibb.co/TvSzk6n/franciscoledesma.jpg', 'https://www.linkedin.com/in/francisco-daniel-ledesma-07182a179/', 'fledesma@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Patricio Whittingslow', 'https://i.ibb.co/JkCmGXZ/patriciowhittingslow.jpg', 'https://www.linkedin.com/in/patricio-whittingslow-3b9564140/', 'pwhittingslow@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Francisco Basili', 'https://i.ibb.co/sKw2BDC/Fran-Basili.jpg', 'https://www.linkedin.com/in/francisco-basili-0a38821b4', 'fbasili@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Matías Sebastian Baiges', 'https://i.ibb.co/cvdfKQ7/oznor-TO-soft.jpg', 'https://www.linkedin.com/in/mat%C3%ADas-baiges-115bb21b4/', 'mbaiges@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Agustin Lara Acosta', 'https://i.ibb.co/g76mW7d/Agustin-Lara.jpg', 'https://www.linkedin.com/in/agustin-lara-acosta-55075b1ab/', 'alara@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
        new IEEEMember('Leandro Ezequiel Rodríguez', 'https://i.ibb.co/tbBkxyH/Ezequiel-Rodriguez.jpg', 'https://www.linkedin.com/in/ezequiel-rodriguez-87484917b/', 'learodriguez@itba.edu.ar', 'HOME.CARGO.EDUCATION.ASSISTANT'),
      ]
    } as Commission,
  ];

  constructor() { }

  getTeams(): Team[] {
    return [
      {
        label: 'Actual',
        commissions: this.teamCurrent,
      } as Team,
      {
        label: '2021',
        commissions: this.team2021,
      } as Team,
      {
        label: '2020',
        commissions: this.team2020,
      } as Team
    ];
  }
}
