import { roles } from '../roles/roles.enum'

export interface IEEEuser {
  fname: string;
  lname: string;
  email: string;
  photoURL: string;
  uID: string;
  role: roles;
}
