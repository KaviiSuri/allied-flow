import type { DefinePermissions, Role } from "./config.js";

export const clientPermissions: Record<Role, DefinePermissions> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SALES: (user, { can }) => {
    /* Empty */
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
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
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MANAGEMENT: (user, { can }) => {
    /* Empty */
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LOGISTICS: (user, { can }) => {
    /* Empty */
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
  },
};
