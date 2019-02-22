import {
  extractFragmentReplacements
} from 'prisma-binding'

import Query from './Query'
import User from './User'
import Mutation from './Mutation'
import Subscription from './Subscription'

const resolvers = {
  Query,
  User,
  Mutation,
  //Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)


export {
  fragmentReplacements,
  resolvers
}