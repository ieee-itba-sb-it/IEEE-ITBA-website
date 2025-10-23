import {collection, CollectionReference, Firestore, query, onSnapshot} from "@angular/fire/firestore";
import {Storage} from "@angular/fire/storage";
import {IeeextremeTeam} from "../../../shared/models/event/ieeextreme/ieeextreme-team";
import {map, Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IeeextremeService{

    private static readonly TEAMS_COLLECTION_NAME = 'ieeextreme-teams';
    private get teamsCollection(): CollectionReference {
        return collection(this.afs, IeeextremeService.TEAMS_COLLECTION_NAME);
    }

    constructor(private afs: Firestore, private firebaseStorage: Storage) {}

    public getAllTeams(): Observable<IeeextremeTeam[]> {
        const q = query(this.teamsCollection);
        return new Observable<IeeextremeTeam[]>((subscriber) => {
            const unsub = onSnapshot(q, (snap) => {
                subscriber.next(snap.docs.map(doc => doc.data() as IeeextremeTeam));
            }, (err) => subscriber.error(err));

            return () => {
                unsub();
            };
        });
    }

}
