export interface Role {
    code: string;
    color: string;
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
    }
]