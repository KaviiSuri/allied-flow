import { DefinePermissions, Role } from "./config";

export const clientPermissions: Record<Role, DefinePermissions> = {
  SALES: (user, { can }) => {},
  ADMIN: (user, { can }) => {
    can("read", "User", ({ teamId }) => teamId === user.teamId);
    can("update", "User", ({ teamId }) => teamId === user.teamId);
    can("create", "User", ({ teamId }) => teamId === user.teamId);
    can("delete", "User", ({ teamId }) => teamId === user.teamId);
    can("read", "Team", ({ teamId }) => teamId === user.teamId);
    can("update", "Team", ({ teamId }) => teamId === user.teamId);
    can("create", "Team", ({ teamId }) => teamId === user.teamId);
    can("delete", "Team", ({ teamId }) => teamId === user.teamId);
  },
  MANAGEMENT: (user, { can }) => {},
  LOGISTICS: (user, { can }) => {},
};
