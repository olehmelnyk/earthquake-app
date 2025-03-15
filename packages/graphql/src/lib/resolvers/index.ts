import { earthquakeResolvers } from './earthquake.resolvers.js';
import { importHistoryResolvers } from './import-history.resolvers.js';
import { dateScalar } from '../schema/scalars.js';

// Merge all resolvers
export const resolvers = {
  Date: dateScalar,
  
  Query: {
    ...earthquakeResolvers.Query,
    ...importHistoryResolvers.Query,
  },
  
  Mutation: {
    ...earthquakeResolvers.Mutation,
  },
};
