import type { Team, UserWithTeam, Product } from "@repo/db/schema";
import { AbilityBuilder, PureAbility, MatchConditions } from "@casl/ability";

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
