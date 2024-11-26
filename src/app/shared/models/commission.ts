import {InternationalText} from "./data-types";
import { IEEEMember } from "./team-member";

export interface Position {
    id: string;
    title: InternationalText;
    order?: number;
    members?: IEEEMember[];
}

export interface Commission {
    id: string;
    title: InternationalText;
    order?: number;
    main: boolean;
    positions: Position[];
    members?: IEEEMember[];
}
