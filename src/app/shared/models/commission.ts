import { TeamMember } from './team-member';
import {InternationalText} from "./data-types";

export interface Commission {
    id: string;
    title: InternationalText;
    position: number;
    main: boolean;
}
