import type { DefinePermissions, Role } from "./config.js";

export const clientPermissions: Record<Role, DefinePermissions> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SALES: (user, { can }) => {
    /* Empty */
  },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MANAGEMENT: (user, { can }) => {
    /* Empty */
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LOGISTICS: (user, { can }) => {
    /* Empty */
  },
};
