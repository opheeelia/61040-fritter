import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FilterCollection from './collection';
import * as filterValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get top X most popular filters
 *
 * @name GET /api/filters?prefix=prefix
 *
 */
router.get(
  '',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const filters = await FilterCollection.findByName(req.query.prefix as string, req.session.userId);
    res.status(200).json({filters: filters});
  }
);

/**
 * Get all filters for a freet by a user
 *
 * @name GET /api/filters/mine
 *
 */
router.get(
  '/mine',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const filters = await FilterCollection.findByUser(req.session.userId);
    res.status(200).json({filters: filters});
  },
);

/**
 * Create a filter
 *
 * @name POST /api/filters
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const filter = await FilterCollection.addOne(
      req.body.name,
      req.session.userId,
      req.body.publicFilter,
      req.body.include,
      req.body.exclude
    );

    res.status(201).json({
      message: `You successfully create a filter.`,
      filters: util.constructFilterResponse(filter)
    });
  }
);

/**
 * Delete filter
 *
 * @name DELETE /api/filters/:filterId
 *
 */
router.delete(
  '/:filterId',
  [
    userValidator.isUserLoggedIn,
    filterValidator.isValidFilterModifier
  ],
  async (req: Request, res: Response) => {
    const deleted = await FilterCollection.deleteOne(req.params.filterId);
    if (deleted) {
      res.status(200).json({
        message: `You successfully deleted your filter.`,
      });
    } else {
      res.status(404).json({
        error: {
          filterNotFound: `Could not delete filter with id ${req.params.filterId}`
        },
      });
    }
  }
);


export {router as filterRouter};
