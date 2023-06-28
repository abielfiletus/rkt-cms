import { AppAbility, CheckAbility } from '../configs/acl'
import { AnyAbility } from '@casl/ability'

export const abilityChecker = (ability: AppAbility | AnyAbility, checkAbility: CheckAbility) => {
  let res = false
  if (ability && typeof checkAbility === 'object') {
    if (typeof checkAbility.action === 'object' && typeof checkAbility.subject === 'object') {
      for (const action of checkAbility.action) {
        let test1 = false

        for (const subject of checkAbility.subject) {
          const test2 = ability.can(action, subject)

          if (test2) {
            test1 = true
            res = true
            break
          }
        }

        if (test1) break
      }
    } else if (typeof checkAbility.action === 'object' && typeof checkAbility.subject === 'string') {
      for (const action of checkAbility.action) {
        const test = ability.can(action, checkAbility.subject)

        if (test) {
          res = true
          break
        }
      }
    } else if (typeof checkAbility.action === 'string' && typeof checkAbility.subject === 'object') {
      for (const subject of checkAbility.subject) {
        const test = ability.can(checkAbility.action, subject)

        if (test) {
          res = true
          break
        }
      }
    } else if (typeof checkAbility.action === 'string' && typeof checkAbility.subject === 'string') {
      res = ability.can(checkAbility.action, checkAbility.subject)
    }
  }

  return res
}
