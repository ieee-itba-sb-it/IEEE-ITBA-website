import {collection, CollectionReference, Firestore, getDocs, query} from "@angular/fire/firestore";
import {Storage} from "@angular/fire/storage";
import {IeeextremeTeam} from "../../../shared/models/event/ieeextreme/ieeextreme-team";
import {map, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IeeextremeService{

    private static readonly TEAMS_COLLECTION_NAME = 'ieeextreme-teams';
    private teamsCollection: CollectionReference = collection(this.afs, IeeextremeService.TEAMS_COLLECTION_NAME);


    constructor(private afs: Firestore, private firebaseStorage: Storage) {}

    public getAllTeams(): Observable<IeeextremeTeam[]> {
        return fromPromise(getDocs(query(this.teamsCollection))).pipe(
            map(snap => snap.docs.map(doc => doc.data() as IeeextremeTeam))
        )
    }

}
