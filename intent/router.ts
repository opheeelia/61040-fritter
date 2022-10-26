import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import IntentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as intentValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * View all of the freets that contain the intent
 *
 * @name GET /api/intent/view?intent=intent
 *
 */
 router.get(
  '/view',
  async (req: Request, res: Response) => {
    const freets = await IntentCollection.findFreetsWithIntent(req.query.intent as string);
    res.status(200).json({freets: freets});
  }
);

/**
 * Get intent of a freet
 *
 * @name GET /api/intent/:freetId?
 *
 * @return {IntentResponse} - Intent of the freet
 *
 * @throws {404} - If the freet does not have intent
 * @throws {404} - If the freetId is not valid
 */
router.get(
  '/:freetId?',
  [
    freetValidator.isFreetExists,
    intentValidator.isIntentExists
  ],
  async (req: Request, res: Response) => {
    const intent = await IntentCollection.findOne(req.params.freetId);
    const response = util.constructIntentResponse(intent);
    res.status(200).json(response);
  }
);

/**
 * Create a new intent for a specific freet.
 *
 * @name POST /api/intent/:freetId?
 *
 * @param {string} intent - The intent type
 * @param {string} supplement - The intent type
 * @return {IntentResponse} - The created intent
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is not valid
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {400} - If the intent already exists
 * @throws {400} - If the intent is not a valid intent type
 * @throws {400} - If the intent supplement is not a valid link or if it is not supplied in an inform intent
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    intentValidator.isIntentNew,
    intentValidator.isValidIntent,
    intentValidator.isValidSupplement
  ],
  async (req: Request, res: Response) => {
    const intent = await IntentCollection.addOne(req.params.freetId, req.body.intent, req.body.supplement);

    res.status(201).json({
      message: `Your intent for freet ${req.params.freetId} was created successfully.`,
      intent: util.constructIntentResponse(intent)
    });
  }
);

/**
 * Delete an intent of a freet
 *
 * @name DELETE /api/intent/:freetId?
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    intentValidator.isIntentExists
  ],
  async (req: Request, res: Response) => {
    await IntentCollection.deleteOne(req.params.freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

export {router as intentRouter};
