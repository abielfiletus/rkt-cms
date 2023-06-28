import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete' | 'approve' | 'download'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

export type CheckAbility = {
  action: Actions | Actions[]
  subject: string | string[]
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (abilities: CheckAbility[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  // can('read', 'dashboard')
  // can('create', 'dashboard')
  // console.log('here')

  for (const ability of abilities) {
    if (typeof ability.action === 'object' && typeof ability.subject === 'object') {
      for (const action of ability.action) {
        for (const subject of ability.subject) {
          can(action, subject)
        }
      }
    } else if (typeof ability.action === 'string' && typeof ability.subject === 'object') {
      for (const subject of ability.subject) {
        can(ability.action, subject)
      }
    } else if (typeof ability.action === 'object' && typeof ability.subject === 'string') {
      for (const action of ability.action) {
        can(action, ability.subject)
      }
    } else if (typeof ability.action === 'string' && typeof ability.subject === 'string') {
      can(ability.action, ability.subject)
    }
  }

  // if (role === 'admin') {
  //   can('manage', 'all')
  // } else if (role === 'client') {
  //   can(['read'], 'acl-page')
  // } else {
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }

  return rules
}

export const buildAbilityFor = (ability: CheckAbility[]): AppAbility => {
  return new AppAbility(defineRulesFor(ability), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
