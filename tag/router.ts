import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import * as tagValidator from './middleware';
import * as util from './util';

const router = express.Router();

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
    tagValidator.isTagExists,
    tagValidator.isValidTag
  ],
  async (req: Request, res: Response) => {
    const tag = await TagCollection.addOne(req.body.tagLabel, req.params.freetId);

    res.status(201).json({
      message: `You successfully tagged freet ${req.body.freetId} with ${req.body.tagLabel}.`,
      tag: util.constructTagResponse(tag)
    });
  }
);

// /**
//  * View all of the freets that contain the label
//  *
//  * @name GET /api/tags/:tagLabel
//  *
//  */
// router.get(
//   '/:tagLabel',
//   async (req: Request, res: Response) => {
//     const freets = await TagCollection.findFreetsLabeledBy(req.params.tagLabel);
//     res.status(200).json({freets: freets});
//   }
// );



export {router as tagRouter};
