import type { DefinePermissions, Role } from "./config.js";

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
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
    can("list", "Order");
    can("create", "Order");
    can("read", "Order");
    can("update", "Order");
    can("delete", "Order");
  },
  MANAGEMENT: (user, { can }) => {
    // admin can do all actions on User and Team
    can("read", "User", ({ teamId }) => teamId === user.teamId);
    can("update", "User", ({ teamId }) => teamId === user.teamId);
    can("create", "User", ({ teamId }) => teamId === user.teamId);
    can("read", "Team");
    can("update", "Team");
    can("create", "Team");
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
    can("list", "Order");
    can("create", "Order");
    can("read", "Order");
    can("update", "Order");
    can("delete", "Order");
  },

  SALES: (user, { can }) => {
    /* Empty */
    can("list", "Inquiry");
    can("raise", "Inquiry");
    can("negotiate", "Inquiry");
    can("accept", "Inquiry");
    can("reject", "Inquiry");
    can("getDetails", "Inquiry");
  },

  LOGISTICS: (user, { can }) => {
    /* Empty */
    can("list", "Order");
    can("read", "Order");
    can("update", "Order");
  },
};
