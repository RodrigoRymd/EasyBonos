import { Role } from "../enums/role";
import { ResponseData } from "./responseData";

export interface User extends ResponseData {
  email?: string;
  userId?: number;
  profileId?: number;
  role?: Role;
}
