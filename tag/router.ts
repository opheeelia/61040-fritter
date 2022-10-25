import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import * as tagValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();


/**
 * View all of the freets that contain the label
 *
 * @name GET /api/tags/view?tag=tagLabel
 *
 */
 router.get(
  '/view',
  async (req: Request, res: Response) => {
    const freets = await TagCollection.findFreetsLabeledBy(req.query.tag as string);
    res.status(200).json({freets: freets});
  }
);

/**
 * Get top X most popular tags
 *
 * @name GET /api/tags/
 *
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const prefix = req.query.prefix ? req.query.prefix as string : "";
    const labels = await TagCollection.findAllLabels(prefix);
    res.status(200).json({tags: labels});
  }
);

/**
 * Add tags to a freet
 *
 * @name POST /api/tags/:freetId
 *
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    tagValidator.doTagsExist,
    tagValidator.areValidTags
  ],
  async (req: Request, res: Response) => {
    const tags = await TagCollection.addAll(req.body.tagLabels, req.params.freetId);

    res.status(201).json({
      message: `You successfully tagged freet ${req.body.freetId} with ${req.body.tagLabels}.`,
      tags: tags.map((tag)=>util.constructTagResponse(tag))
    });
  }
);


export {router as tagRouter};
