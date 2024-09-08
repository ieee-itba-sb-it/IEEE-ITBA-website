import {ThemePalette} from "@angular/material/core";

export interface Role {
    code: string;
    color: ThemePalette;
}

export const roles: (Role | null)[] = [
    null,
    {
        code: "ADMIN.USERTAB.ROLES.ADMIN",
        color: "primary"
    },
    {
        code: "ADMIN.USERTAB.ROLES.WRITER",
        color: "accent"
    },
    {
        code: "ADMIN.USERTAB.ROLES.IEEEMEMBER",
        color: "warn"
    }
]
