import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import SuggestionCollection from './collection';
import * as suggestionValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * View all of the freets that have the suggestion
 *
 * @name GET /api/suggestions/view?suggestion={suggestion}&type={suggestionType}
 *
 */
 router.get(
  '/view',
  async (req: Request, res: Response) => {
    const freets = await SuggestionCollection.findFreetsWithSuggestion(
      req.query.suggestion as string,
      req.query.type as util.SuggestionType,
    );
    res.status(200).json({freets: freets});
  }
);

/**
 * Get most popular suggestions
 *
 * @name GET /api/suggestions/:freetId?type=SUGGESTION_TYPE
 * 
 * @throws {404} if the freet_id is invalid
 */
router.get(
  '/:freetId',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if suggestion type query parameter was supplied
    if (req.query.type !== undefined) {
      // hacky: put in body for validation
      req.body = {suggestionType: req.query.type as string};
      next();
      return;
    }
    let labels = [];
    for (let suggestionType of Object.keys(util.SuggestionType)){
      labels.push(...(await SuggestionCollection.findAllByType(suggestionType, req.params.freetId)));
    }
    res.status(200).json({suggestions: labels});
    return;
  },
  [
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const suggestions = await SuggestionCollection.findAllByType(req.query.type as string, req.params.freetId);
    res.status(200).json({suggestions: suggestions});
  }
);

/**
 * Get all suggestions for a freet by a user
 *
 * @name GET /api/suggestions/:freetId/mine
 *
 * @throws {403} if the user is not logged in
 * @throws {404} if the freet_id is invalid
 */
router.get(
  '/:freetId/mine',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const suggestions = await SuggestionCollection.findAllBySuggestor(req.session.userId, req.params.freetId);
    res.status(200).json({suggestions: suggestions});
  },
);

/**
 * Add suggestion to a freet
 *
 * @name POST /api/suggestions/:freetId
 * 
 * @throws {403} if the user is not logged in
 * @throws {404} if the freet_id is invalid
 * @throws {400} if the suggestion is not valid
 * @throws {400} if the suggestion was already made by the user 
 */
router.post(
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    suggestionValidator.isValidSuggestion,
    suggestionValidator.isSuggestionExist
  ],
  async (req: Request, res: Response) => {
    const suggestion = await SuggestionCollection.addOne(req.body.suggestion, req.body.suggestionType, req.params.freetId, req.session.userId);

    res.status(201).json({
      message: `You successfully suggested a ${req.body.suggestionType} for freet ${req.body.freetId}.`,
      suggestions: util.constructSuggestionResponse(suggestion)
    });
  }
);

/**
 * Delete suggestion to a freet
 *
 * @name DELETE /api/suggestions/:suggestionId
 * 
 * @throws {403} if the user is not logged in
 * @throws {403} if the user is not the author of the referenced freet
 * @throws {404} if the freet_id is invalid
 */
router.delete(
  '/:suggestionId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    suggestionValidator.isValidSuggestionModifier
  ],
  async (req: Request, res: Response) => {
    const deleted = await SuggestionCollection.deleteOne(req.params.suggestionId);
    if (deleted) {
      res.status(200).json({
        message: `You successfully deleted your suggestion.`,
      });
    } else {
      res.status(404).json({
        error: {
          suggestionNotFound: `Could not delete suggestion with id ${req.params.suggestionId}`
        },
      });
    }
  }
);


export {router as suggestionRouter};
