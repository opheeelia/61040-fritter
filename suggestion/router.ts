import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SuggestionCollection from './collection';
import * as suggestionValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get top X most popular suggestions
 *
 * @name GET /api/suggestions/:freetId?type=SUGGESTION_TYPE
 *
 */
router.get(
  '/:freetId',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if suggestion type query parameter was supplied
    if (req.query.type !== undefined) {
      next();
      return;
    }
    // TODO: get all of the types and combine them to send response
    const prefix = req.query.prefix ? req.query.prefix as string : "";
    const labels = await SuggestionCollection.findAllByType(req.query.type as string, req.params.freetId);
    res.status(200).json({suggestions: labels});
    return;
  },
  [
    // TODO: validation
  ],
  async (req: Request, res: Response) => {
    const suggestions = await SuggestionCollection.findAllByType(req.query.type as string, req.params.freetId);
    res.status(200).json({suggestions: suggestions});
  }
);

/**
 * Get all suggestions by a user
 *
 * @name GET /api/suggestions/:freetId/:userId
 *
 */
router.get(
  '/:freetId/:userId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    const suggestions = await SuggestionCollection.findAllBySuggestor(req.params.userId, req.params.freetId);
    res.status(200).json({suggestions: suggestions});
  },
);

/**
 * Add suggestions to a freet
 *
 * @name POST /api/suggestions/:freetId
 *
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    suggestionValidator.isSuggestionExist,
    suggestionValidator.areValidSuggestions
  ],
  async (req: Request, res: Response) => {
    const suggestions = await SuggestionCollection.addAll(req.body.suggestionLabels, req.params.freetId);

    res.status(201).json({
      message: `You successfully suggestionged freet ${req.body.freetId} with ${req.body.suggestionLabels}.`,
      suggestions: suggestions.map((suggestion)=>util.constructSuggestionResponse(suggestion))
    });
  }
);


export {router as suggestionRouter};
