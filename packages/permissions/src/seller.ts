import { DefinePermissions, Role } from "./config.js";

export const sellerPermissions: Record<Role, DefinePermissions> = {
  ADMIN: (user, { can }) => {
    // admin can do all actions on User and Team
    can("read", "User", ({ teamId }) => teamId === user.teamId);
    can("update", "User", ({ teamId }) => teamId === user.teamId);
    can("create", "User", ({ teamId }) => teamId === user.teamId);
    can("delete", "User", ({ teamId }) => teamId === user.teamId);
    can("read", "Team");
    can("update", "Team");
    can("delete", "Team");
    can("create", "Team");
    can("read", "Product");
    can("update", "Product");
    can("delete", "Product");
    can("create", "Product");
  },
  MANAGEMENT: (user, { can }) => {
    // admin can do all actions on User and Team
    can("read", "User", ({ teamId }) => teamId === user.teamId);
    can("update", "User", ({ teamId }) => teamId === user.teamId);
    can("create", "User", ({ teamId }) => teamId === user.teamId);
    can("read", "Team");
    can("update", "Team");
    can("create", "Team");
  },
  SALES: (user, { can }) => {},
  LOGISTICS: (user, { can }) => {},
};
