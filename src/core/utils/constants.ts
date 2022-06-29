import { User } from "../models/dtos/user";
import { Role } from "../models/enums/role";

export const auxUser: User = {
  email: "example@hotmail.com",
  userId: 1,
  profileId: 1,
  role: Role.NaturalPerson,
};
