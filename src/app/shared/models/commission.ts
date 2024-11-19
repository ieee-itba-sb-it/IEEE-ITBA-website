import {InternationalText} from "./data-types";

export interface Position {
    id: string;
    title: InternationalText;
    order?: number;
}

export interface Commission {
    id: string;
    title: InternationalText;
    order?: number;
    main: boolean;
    positions: Position[];
}
