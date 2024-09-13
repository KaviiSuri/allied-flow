import type {
  Team,
  UserWithTeam,
  Product,
  Inquiry,
  Order,
} from "@repo/db/schema";
import type {
  AbilityBuilder,
  PureAbility,
  MatchConditions,
} from "@casl/ability";

const crudActions = ["read", "create", "update", "delete"] as const;

export type SubjectsWithTypes = {
  User: {
    type: UserWithTeam;
    actions: (typeof crudActions)[number];
  };
  Team: {
    type: Team;
    actions: (typeof crudActions)[number];
  };
  Product: {
    type: Product;
    actions: (typeof crudActions)[number];
  };
  Inquiry: {
    type: Inquiry;
    actions:
      | "raise"
      | "negotiate"
      | "accept"
      | "reject"
      | "getDetails"
      | "list";
  };
  Order: {
    type: Order;
    actions: "create" | "list" | "read" | "update" | "delete";
  };
};

// Using a generic function to map SubjectsWithTypes to AppAbilities
type ConvertToAbilities<T extends Record<string, { type: any; actions: any }>> =
  {
    [K in keyof T]: [T[K]["actions"], K | T[K]["type"]];
  }[keyof T];

export type AppAbilities = ConvertToAbilities<SubjectsWithTypes>;

export type DefinePermissions = (
  user: UserWithTeam,
  builder: AbilityBuilder<PureAbility<AppAbilities, MatchConditions>>,
) => void;

export type TeamType = UserWithTeam["team"]["type"];
export type Role = UserWithTeam["role"];
