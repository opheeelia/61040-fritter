import type {Request, Response, NextFunction} from 'express';
import FilterCollection from '../filter/collection';
import {Types} from 'mongoose';

/**
 * Checks if a filter exists
 */
const isFilterExists = async (req: Request, res: Response, next: NextFunction) => {
  const filterId = req.params.filterId ? req.params.filterId : req.query.filterId as string
  const validFormat = Types.ObjectId.isValid(filterId);
  const filter = validFormat ? await FilterCollection.findOne(filterId) : '';
  if (!filter) {
    res.status(404).json({
      error: `Filter with ID ${filterId} does not exist.`
    });
    return;
  }

  next();
};


/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isValidFilterModifier = async (req: Request, res: Response, next: NextFunction) => {
  const filterId = req.params.filterId ? req.params.filterId : req.query.filterId as string
  const filter = await FilterCollection.findOne(filterId);
  const userId = filter.creatorId;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot read/modify other users\' filters.'
    });
    return;
  }

  next();
};

export {
  isFilterExists,
  isValidFilterModifier,
};
