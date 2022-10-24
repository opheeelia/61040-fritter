import type {Request, Response, NextFunction} from 'express';
import FilterCollection from '../filter/collection';
import { FilterType } from './util';
import { IntentType } from '../intent/util';

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isValidFilterModifier = async (req: Request, res: Response, next: NextFunction) => {
    const filter = await FilterCollection.findOne(req.params.filterId);
    const userId = filter.creatorId;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' filters.'
      });
      return;
    }
  
    next();
  };

export {
    isValidFilterModifier,
};
