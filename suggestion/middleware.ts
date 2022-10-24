import type {Request, Response, NextFunction} from 'express';
import SuggestionCollection from '../suggestion/collection';
import { SuggestionType } from './util';
import { IntentType } from '../intent/util';

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
 const isValidSuggestionModifier = async (req: Request, res: Response, next: NextFunction) => {
    const suggestion = await SuggestionCollection.findOneById(req.params.suggestionId);
    const userId = suggestion.suggestorId;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' suggestions.'
      });
      return;
    }
  
    next();
  };

/**
 * Checks if freet suggestion exists
 */
const isSuggestionExist = async (req: Request, res: Response, next: NextFunction) => {
    const suggestion = await SuggestionCollection.findOne(req.body.suggestion, req.body.suggestionType, req.session.userId, req.params.freetId);
    if (suggestion) {
        res.status(400).json({
        error: {
            suggestionAlreadyxists: `Suggestion ${req.body.suggestion} of freet ID ${req.params.freetId} already exists.`
        }
        });
        return;
    }
    next();
};

/**
 * Checks if the suggestion is a valid
 */
const isValidSuggestion = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.suggestionType in SuggestionType){
        if (req.body.suggestionType == SuggestionType.Tag) {
            const pattern = new RegExp("^[\\w]+$");
            if (!pattern.test(req.body.suggestion)) {
                res.status(400).json({
                error: {
                    invalidSuggestion: 'Labels must contain only upper and lower case letters, or underscores and must be non-empty'
                }
                });
                return;
            }
        } else if (req.body.suggestionType == SuggestionType.Intent) {
            if (!(req.body.suggestion in IntentType)) {
                res.status(400).json({
                    error: {
                        invalidSuggestion: `${req.body.suggestion} is not a valid intent.`
                    }
                });
                return;
            }
        } else if (req.body.suggestionType == SuggestionType.Supplement) {
            const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            if (!(pattern.test(req.body.suggestion))) {
                res.status(400).json({
                    error: {
                        invalidSuggestion: 'Supplement must be a valid link.'
                    }
                  });
                  return;
            }
        }
    }
    next();
}

export {
    isSuggestionExist,
    isValidSuggestionModifier,
    isValidSuggestion
};
