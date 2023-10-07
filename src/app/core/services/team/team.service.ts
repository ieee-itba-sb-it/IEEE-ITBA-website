import {IEEEMember} from '../../../shared/models/team-member';
import {Injectable} from '@angular/core';
import {Commission} from 'src/app/shared/models/commission';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {map, Observable} from 'rxjs';
import {IEEEUserResponse} from '../../../shared/models/ieee-user/ieee-user.response';
import {CommissionType} from '../../../shared/models/ieee-user/ieee-team.enums';
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private static readonly TEAM_COLLECTION_NAME = 'team';
    constructor(private firestore: AngularFirestore) {

    }

    static TEAM_MAPPER = {
        [CommissionType.CD]: 'HOME.CARGO.CD.TITLE',
        [CommissionType.MEDIACOM]: 'HOME.CARGO.MEDIACOM.TITLE',
        [CommissionType.ID]: 'HOME.CARGO.ID.TITLE',
        [CommissionType.EDUCATION]: 'HOME.CARGO.EDUCATION.TITLE',
        [CommissionType.FUNDRAISING]: 'HOME.CARGO.FUNDRAISING.TITLE',
        [CommissionType.IT]: 'HOME.CARGO.IT.TITLE',
        [CommissionType.RAS]: 'RAS',
        [CommissionType.EMB]: 'EMB'
    };

    // private teamCurrent = [
    //     {
    //         name: this.teamMapper[CommissionType.CD],
    //         team: [
    //             new IEEEMember('Agustin Luis Gullino', 'https://i.ibb.co/qr7P1R8/agustin-gullino.jpg', 'https://www.linkedin.com/in/agust%C3%ADn-gullino-a87083197/', 'agullino@itba.edu.ar', 'HOME.CARGO.CD.OFFICER'),
    //             new IEEEMember('Josue Francisco Laszeski', 'https://i.ibb.co/jbdn3WT/JOSUE-FRANCISCO-LASZESKI.jpg', 'https://www.linkedin.com/in/jlaszeski/', 'jlaszeski@itba.edu.ar', 'HOME.CARGO.CD.OFFICER'),
    //             new IEEEMember('Nicolás Bustelo', 'https://i.ibb.co/MG4Kkcx/Nicol-s-Bustelo.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-bustelo/', 'nbustelo@itba.edu.ar', 'HOME.CARGO.CD.OFFICER'),
    //             new IEEEMember('Brisa Rojas', 'https://i.ibb.co/09bzKCg/brisa-rojas.jpg', 'https://www.linkedin.com/in/rojas-brisa/', 'brojas@itba.edu.ar', 'HOME.CARGO.CD.OFFICER'),
    //         ]
    //     },
    //     {
    //         name: this.teamMapper[CommissionType.MEDIACOM],
    //         team: [
    //             new IEEEMember('Agustín Cabantous Soler',  'https://i.ibb.co/pJqgdPN/AGUSTIN-CABANTOUS-SOLER.jpg', 'https://www.linkedin.com/in/agustin-cabantous-soler-349908190', 'acabantous@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIRECTOR'),
    //             new IEEEMember('Nicolás Matías Margenat', 'https://i.ibb.co/rH10c0r/NICOL-S-MAT-AS-MARGENAT.png', 'https://www.linkedin.com/in/nicolas-margenat/', 'nmargenat@itba.edu.ar', 'HOME.CARGO.MEDIACOM.DIRECTOR'),
    //             new IEEEMember('Clara Muruzábal', 'https://i.ibb.co/tBy47wy/clara-muruzabal.jpg', 'https://www.linkedin.com/in/claramuruzabal', 'cmuruzabal@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CCA'),
    //             new IEEEMember('Juan Bautista Capristo', 'https://i.ibb.co/ZmVMww0/Juan-Bautista-Capristo.png', 'https://www.linkedin.com/in/juanbautistacapristo/', 'jcapristo@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CC'),
    //             new IEEEMember('Paula Ariana Gonzalez', 'https://i.ibb.co/zN08Yby/paula-ariana-gonzalez.jpg', 'https://www.linkedin.com/in/paula-gonzalez-33a835208', 'paulgonzalez@itba.edu.ar', 'HOME.CARGO.MEDIACOM.CCA'),
    //             new IEEEMember('Alexander Stephan Moldovan Loayza', 'https://i.ibb.co/LP4GRQp/alexmoldovan.jpg', 'linkedin.com/in/alexander-moldovan-a22842145', 'amoldovan@itba.edu.ar', 'HOME.CARGO.MEDIACOM.ILLUSTRATOR'),
    //             new IEEEMember('Zahira Abril Jiménez', 'https://i.ibb.co/DbFNzKC/Zahira-Gimenez.jpg', 'https://www.linkedin.com/in/zahira-abril-jim%C3%A9nez-87b9a224a', 'zjimenez@itba.edu.ar', 'HOME.CARGO.MEDIACOM.ILLUSTRATOR'),
    //             new IEEEMember('Julia Sexe', 'https://i.ibb.co/ZdK5PfT/julia-sexe.jpg', 'https://www.linkedin.com/in/julia-sexe-48a294269', 'jusexe@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WRITER-FEM'),
    //             new IEEEMember('Lucas Catolino', 'https://i.ibb.co/6Fy24rg/Lucas-Catolino.jpg', 'https://www.linkedin.com/in/lucas-catolino-431b52167/', 'lcatolino@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WRITER-MASC'),
    //             new IEEEMember('Victor Christian Oh', 'https://i.ibb.co/gdghPf3/Victor-Christian-Oh.jpg', 'https://www.linkedin.com/in/victor-oh-947369163/?originalSubdomain=ar', 'voh@itba.edu.ar', 'HOME.CARGO.MEDIACOM.WRITER-MASC'),
    //         ]
    //     },
    //     {
    //         name: this.ID,
    //         team: [
    //             new IEEEMember('Facundo Ezequiel Di Toro', 'https://i.ibb.co/ZSRZTzJ/facundo-di-toro.jpg', 'https://www.linkedin.com/in/facundoditoro', 'fditoro@itba.edu.ar', 'HOME.CARGO.ID.CHIEF'),
    //             new IEEEMember('Agustín Solari Raigoso', 'https://i.ibb.co/mJhvKzC/Agust-n-Solari-Raigoso.jpg', 'https://www.linkedin.com/in/agustin-solari-raigoso-1362a3142', 'asolariraigoso@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Alejandro Nahuel Heir', 'https://i.ibb.co/w67rCm1/alejandro-heir.jpg', 'https://www.linkedin.com/in/aheir/', 'aheir@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Francisco Alejandro Minniti', 'https://i.ibb.co/zVHh4PV/francisco-minniti.jpg', 'https://www.linkedin.com/in/francisco-minniti/', 'fminniti@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Francisco Mendizabal', 'https://i.ibb.co/vXwdxcZ/Francisco-Mendizabal.jpg', 'https://www.linkedin.com/in/francisco-mendizabal-a422281b4/', 'frmendizabal@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Franco Ezequiel Dorfman', 'https://i.ibb.co/ZWj12Gb/FRANCO-EZEQUIEL-DORFMAN.jpg', 'https://www.linkedin.com/in/franco-ezequiel-dorfman-03612524a', 'fdorfman@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Mateo Bartellini Huapala', 'https://i.ibb.co/bPFR46h/mateo-bartellini-huapala.jpg', 'https://www.linkedin.com/in/mateo-bartellini-huapalla/', 'mbartellini@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Rafael Dalzotto', 'https://i.ibb.co/hDmDDW0/rafael-dalzotto.jpg', 'https://www.linkedin.com/in/rafael-dalzotto', 'rdalzotto@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //             new IEEEMember('Santiago López Franceschini', 'https://i.ibb.co/7kQs4hL/SANTIAGO-L-PEZ-FRANCESCHINI.jpg', 'https://www.linkedin.com/in/santiago-l%C3%B3pez-franceschini-61761021b/', 'slopezfranceschini@itba.edu.ar', 'HOME.CARGO.ID.RESEARCHER'),
    //         ]
    //     },
    //     {
    //         name: this.FUNDRAISING,
    //         team: [
    //             new IEEEMember('Nicolas Agustín Beade', 'https://i.ibb.co/QC3tWPV/nicolas-agustin-beade.jpg', 'https://www.linkedin.com/in/nicolas-agustín-beade-671bb2235/', 'nbeade@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.CHIEF'),
    //             new IEEEMember('Andrés Paolina', 'https://i.ibb.co/YhRDDMf/ANDRES-PAOLINA.jpg', 'https://linkedin.com/in/andres-paolina-gaston', 'apaolina@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.FUNDRAISER'),
    //             new IEEEMember('Juan Ignacio Noms', 'https://i.ibb.co/QDTwMhB/juan-ignacio-noms.jpg', 'https://www.linkedin.com/in/juannoms/', 'jnoms@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.FUNDRAISER'),
    //             new IEEEMember('Julieta Dapelo', 'https://i.ibb.co/0V5BqD1/JULIETA-DAPELO.jpg', 'https://www.linkedin.com/in/julietadapelo/', 'jdapelo@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.FUNDRAISER'),
    //             new IEEEMember('Miranda Ormaechea Graiver', 'https://i.ibb.co/M1MtMmq/MIRANDA-ORMAECHEA-GRAIVER.jpg', 'https://www.linkedin.com/in/miranda-ormaechea-graiver-a54a21198/', 'mormaecheagraiver@itba.edu.ar', 'HOME.CARGO.FUNDRAISING.FUNDRAISER'),
    //         ]
    //     },
    //     {
    //         name: this.EDUCATION,
    //         team: [
    //             new IEEEMember('Alejo Agustín Figueroa', 'https://i.ibb.co/Jy7Frry/ALEJO-AGUSTIN-FIGUEROA.jpg', 'https://www.linkedin.com/in/alejo-agustin-figueroa-204589147/', 'alfigueroa@itba.edu.ar', 'HOME.CARGO.EDUCATION.DIRECTOR'),
    //             new IEEEMember('Ignacio Cutignola', 'https://i.ibb.co/TrMT0Hz/Ignacio-Cutignola.jpg', 'https://www.linkedin.com/in/ignacio-cutignola-4a6865201', 'icutignola@itba.edu.ar', 'HOME.CARGO.EDUCATION.DIRECTOR'),
    //             new IEEEMember('Agustín Chaud Olivieri', 'https://i.ibb.co/7gy8dZP/agustin-chaud-olivieri.jpg', 'https://www.linkedin.com/in/agus-chaud-8394521b5', 'achaudolivieri@itba.edu.ar', 'HOME.CARGO.EDUCATION.TUTOR'),
    //             new IEEEMember('Camila Sanchez', 'https://i.ibb.co/wgB32s1/CAMILA-SANCHEZ.jpg', 'https://www.linkedin.com/in/camila-sanchez-237421217', 'casanchez@itba.edu.ar', 'HOME.CARGO.EDUCATION.TUTORA'),
    //             new IEEEMember('Ignacio Gabriel Sampedro Delgado', 'https://i.ibb.co/svHGXH8/Ignacio-Gabriel-Sampedro-Delgado.jpg', 'https://www.linkedin.com/in/ignacio-gabriel-sampedro-delgado-4a0293133/', 'isampedro@itba.edu.ar', 'HOME.CARGO.EDUCATION.TUTOR'),
    //             new IEEEMember('Mariano Agustín Dolhare', 'https://i.ibb.co/Z6hLFLd/mariano-agustin-dolhare.jpg', 'https://www.linkedin.com/in/mariano-agustin-dolhare-36426a232/', 'mdolhare@itba.edu.ar', 'HOME.CARGO.EDUCATION.TUTOR'),
    //             new IEEEMember('Sofia Hanna Feilbogen', 'https://i.ibb.co/pLxzs60/sofia-hanna-feilbogen.jpg', 'https://www.linkedin.com/in/sof%C3%ADa-feilbogen-8042991b4', 'sfeilbogen@itba.edu.ar', 'HOME.CARGO.EDUCATION.TUTORA'),
    //         ]
    //     },
    //     {
    //         name: this.IT,
    //         team: [
    //             new IEEEMember('Nicolás Ezequiel Birsa', 'https://i.ibb.co/wc0vsMK/NICOLAS-EZEQUIEL-BIRSA.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-ezequiel-birsa-63631a1a1/', 'nbirsa@itba.edu.ar', 'HOME.CARGO.IT.DIRECTOR'),
    //             new IEEEMember('Federico Poyen Shih', 'https://i.ibb.co/3CSRmzL/federico-shih.jpg', 'https://www.linkedin.com/in/federico-shih/', 'fshih@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
    //             new IEEEMember('Juan Burda', 'https://i.ibb.co/5vjMkM5/juan-burda.jpg', 'https://www.linkedin.com/in/juan-burda-433ba3253/', 'jbursa@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
    //             new IEEEMember('Nicolás Matías Rooney', 'https://i.ibb.co/4gqMbMs/NICOL-S-MAT-AS-ROONEY.jpg', 'https://www.linkedin.com/in/nicol%C3%A1s-rooney-803b4815b/', 'nrooney@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
    //             new IEEEMember('Santiago Bassi', 'https://i.ibb.co/mvmWpyK/santiago-bassi.jpg', 'https://www.linkedin.com/in/santiago-bassi-56995b21b/', 'sabassi@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
    //             new IEEEMember('Saul Ariel Castañeda', 'https://i.ibb.co/hgLvcTj/saul-casta-eda.jpg', 'https://www.linkedin.com/in/saul-ariel-casta%C3%B1eda-698b9b253/', 'scastaneda@itba.edu.ar', 'HOME.CARGO.IT.DEV'),
    //         ]
    //     }
    // ];
    //
    // private rasTeam = {
    //     name: 'RAS',
    //     team: [
    //         new IEEEMember('Tomás Wickham', 'https://i.ibb.co/d5dtNRs/tomas-wickham.jpg', 'https://www.linkedin.com/in/tomás-wickham-21b7b2185/', 'twickham@itba.edu.ar', 'HOME.CARGO.RAS.DIRECTOR'),
    //         new IEEEMember('Agustin Casas', 'https://i.ibb.co/Jz6wkhg/agustin-casas.jpg', 'https://www.linkedin.com/in/agust%C3%ADn-casas-7306a6262', 'agcasas@itba.edu.ar', 'HOME.CARGO.RAS.DEV'),
    //         new IEEEMember('Maximiliano Antonio Figueroa', 'https://i.ibb.co/qBcgJG5/maximiliano-figueroa.jpg', 'https://www.linkedin.com/in/mfigueroaa/', 'mfigueroa@itba.edu.ar', 'HOME.CARGO.RAS.DEV'),
    //         new IEEEMember('Rafael Dalzotto', 'https://i.ibb.co/hDmDDW0/rafael-dalzotto.jpg', 'https://www.linkedin.com/in/rafael-dalzotto', 'rdalzotto@itba.edu.ar', 'HOME.CARGO.RAS.DEV'),
    //         new IEEEMember('Santiago Feldman', 'https://i.ibb.co/9YtJ534/santiago-feldman.jpg', 'https://www.linkedin.com/in/santiago-f-3886491b7/', 'sfeldman@itba.edu.ar', 'HOME.CARGO.RAS.DEV'),
    //         new IEEEMember('Santiago Michelotti', 'https://i.ibb.co/nrvdFg0/santiago-michelotti.jpg', 'https://www.linkedin.com/in/santiago-michelotti-5b94291b6', 'smichelotti@itba.edu.ar', 'HOME.CARGO.RAS.RESEARCHER'),
    //     ]
    // };
    //
    // private embTeam = {
    //     name: 'EMB',
    //     team: [
    //         new IEEEMember('Gonzalo Andrés Grau', 'https://i.ibb.co/SxJfHxb/Gonzalo-Andres-Grau.jpg', 'https://www.linkedin.com/in/gonzalo-grau/', 'ggrau@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Lautaro Andrés Gomez', 'https://i.ibb.co/WWpLWqm/Lautaro-Andres-Gomez.jpg', 'https://www.linkedin.com/in/lautaro-andr%C3%A9s-g%C3%B3mez-5a83b4258/', 'lagomez@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Irina de Paz Puratich', 'https://i.ibb.co/gw2ZprC/Irina-Paz-Puratich.jpg', 'https://www.linkedin.com/in/irina-de-paz-puratich-9bb31b250/', 'idepazpuratich@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Agustín Kiwi Miguel', 'https://i.ibb.co/XXTr3tm/Agustin-Kiwi-Miguel.jpg', 'https://www.linkedin.com/in/agustin-miguel-5a3474209/', 'agmiguel@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Juan Bautista Gonzalez', 'https://i.ibb.co/W2B0DxN/Juan-Bautista-Gonzales.jpg', 'https://www.linkedin.com/in/juan-bautista-gonzalez-martin-53293b218/', 'jgonzalezmartin@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Lucas Franzi', 'https://i.ibb.co/2ncFxgp/Lucas-Franzi.jpg', 'https://www.linkedin.com/in/lucas-franzi-a7752820b/', 'lfranzi@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Dino Alberti', 'https://i.ibb.co/MGFYgQJ/Dino-Alberti.jpg', 'https://www.linkedin.com/in/dino-alberti-961a0625b/', 'dalberti@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Ivo Bajlec', 'https://i.ibb.co/pnn7ytj/Ivo-Bajlec.jpg', 'https://www.linkedin.com/in/ivo-bajlec-493120150', 'ibajlec@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Felipe Olivera Rial', 'https://i.ibb.co/wwZS9pb/Felipe-Olivera-Rial.jpg', 'https://www.linkedin.com/in/felipe-olivera-rial-71b199278', 'feolivera@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Facundo Bosch', 'https://i.ibb.co/G227gHP/Facundo-Bosch.jpg', 'https://www.linkedin.com/in/facundo-bosch-38637523b/', 'fbosch@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Josefina Brau', 'https://i.ibb.co/N71cmRv/Josefina-Brau.jpg', 'https://www.linkedin.com/in/josefina-brau-099a36277', 'jbrau@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Bianca Soto', 'https://i.ibb.co/9pBwPGb/Bianca-Soto.jpg', 'www.linkedin.com/in/bianca-jocelyn-soto-acosta-005990239/', 'bsotoacosta@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Emiliano Gonzales Paez', 'https://i.ibb.co/vkV06Hz/Emiliano-Gonzales-Paez.jpg', 'https://www.linkedin.com/in/andr%C3%A9s-emilio-gonz%C3%A1lez-paez-663495209/', 'angonzalez@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Francisco Barca', 'https://i.ibb.co/xFdFgCk/Francisco-Barca.jpg', 'https://www.linkedin.com/in/francisco-jos%C3%A9-barca-b5b65822b/', 'fbarca@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Tomas De La Valle', 'https://i.ibb.co/QKpb54F/Tomas-De-La-Valle.jpg', 'https://www.linkedin.com/in/tomas-d-90809a132', 'tdelallave@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Juan Manuel Peirano', 'https://i.ibb.co/Fn0cXRn/Juan-Manuel-Peirano.jpg', 'https://www.linkedin.com/in/juan-manuel-peirano-2731ab278', 'jpeirano@itba.edu.ar', 'NULL'),
    //         new IEEEMember('Karolina Tenca', 'https://i.ibb.co/G0x842M/Karolina-Tenca.jpg', 'https://www.linkedin.com/in/karolina-tenca-577553207/', 'ktenca@itba.edu.ar', 'NULL'),
    //     ]
    // };

    getCurrentTeam(): Observable<Commission[]> {
        return this.firestore.collection(TeamService.TEAM_COLLECTION_NAME,
            ref => ref.where('commission', 'not-in', [CommissionType.RAS, CommissionType.EMB])).get()
            .pipe(map(TeamService.mapQuerySnapshotToCommission));
    }

    getRasTeam(): Observable<Commission> {
        return this.getSingularTeam(CommissionType.RAS);
    }

    getEmbTeam(): Observable<Commission> {
        return this.getSingularTeam(CommissionType.EMB);
    }

    private getSingularTeam(commissionType: CommissionType): Observable<Commission> {
        return this.firestore.collection(TeamService.TEAM_COLLECTION_NAME, ref => ref.where('commission', '==', commissionType))
            .get()
            .pipe(map(TeamService.mapQuerySnapshotToCommission))
            .pipe(map(commissions => {
                if (commissions.length === 0) return {
                    name: TeamService.TEAM_MAPPER[CommissionType.RAS],
                    team: []
                }
                return commissions[0];
            }))
    }

    private static mapQuerySnapshotToCommission(querySnapshot: firebase.firestore.QuerySnapshot<unknown>): Commission[] {
        if (querySnapshot.empty) return [];
        const commissionMap = new Map<string, IEEEMember[]>();
        querySnapshot.forEach(doc => {
            const userResponse: IEEEUserResponse = doc.data() as IEEEUserResponse;
            if (!commissionMap.has(userResponse.commission)) {
                commissionMap.set(userResponse.commission, []);
            }
            commissionMap.get(userResponse.commission).push(IEEEMember.fromIeeeUserResponse(userResponse));
        });

        return [...commissionMap.entries()].map(([commission, team]) => {
            return {
                name: TeamService.TEAM_MAPPER[commission],
                team
            }
        });
    }
}
