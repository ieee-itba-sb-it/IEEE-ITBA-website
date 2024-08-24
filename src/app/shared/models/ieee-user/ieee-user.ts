import { roles } from '../roles/roles.enum'

export interface IEEEuser {
  fullname: string;
  email: string;
  verifiedEmail?: boolean;
  photoURL: string;
  uID: string;
  role: roles;
  linkedin?: string;
}
