import type { UserWithTeam } from "@repo/db/schema";
import { AbilityBuilder, PureAbility, MatchConditions } from "@casl/ability";
import {
  AppAbilities,
  DefinePermissions,
  Role,
  SubjectsWithTypes,
  TeamType,
} from "./config.js";
import { clientPermissions } from "./client.js";
import { sellerPermissions } from "./seller.js";

export type {
  AppAbilities,
  Role,
  TeamType,
  SubjectsWithTypes,
} from "./config.js";

const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

const userPermissions: Record<TeamType, Record<Role, DefinePermissions>> = {
  SELLER: sellerPermissions,
  CLIENT: clientPermissions,
};

export function defineAbilityFor(user: UserWithTeam) {
  const builder = new AbilityBuilder(
    PureAbility<AppAbilities, MatchConditions>,
  );
  userPermissions[user.team.type][user.role](user, builder);
  return builder.build({
    conditionsMatcher: lambdaMatcher,
  });
}

type ForcedSubject<T> = T & { __caslSubjectType__: keyof SubjectsWithTypes };

export const defaultAbility = new AbilityBuilder(
  PureAbility<AppAbilities, MatchConditions>,
).build({ conditionsMatcher: lambdaMatcher });

export function an<S extends keyof SubjectsWithTypes>(
  s: S,
  t: SubjectsWithTypes[S]["type"],
): ForcedSubject<SubjectsWithTypes[S]["type"]> {
  return {
    ...t,
    __caslSubjectType__: s,
  };
}
