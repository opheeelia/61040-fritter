import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import TagCollection from '../tag/collection';

// /**
//  * Checks if a freet with freetId is req.params exists
//  */
//  const isIntentNew = async (req: Request, res: Response, next: NextFunction) => {
//   const validFormat = Types.ObjectId.isValid(req.params.freetId);
//   const intent = validFormat ? await IntentCollection.findOne(req.params.freetId) : '';
//   if (intent) {
//     res.status(404).json({
//       error: {
//         intentNotFound: `Intent with freet ID ${req.params.freetId} already exists.`
//       }
//     });
//     return;
//   }

//   next();
// };

/**
 * Checks if freet tag combo exists
 */
const isTagExists = async (req: Request, res: Response, next: NextFunction) => {
    const tag = await TagCollection.findOne(req.body.tagLabel, req.params.freetId);
    if (tag) {
        res.status(400).json({
        error: {
            intentNotFound: `Tag ${req.params.tagLabel} with freet ID ${req.params.freetId} already exists.`
        }
        });
        return;
    }

    next();
};

/**
 * Checks if the tag is a valid
 */
const isValidTag = (req: Request, res: Response, next: NextFunction) => {
    const pattern = new RegExp("^[\\w]+$");
    if (!req.body.tagLabel || !pattern.test(req.body.tagLabel)) {
        res.status(400).json({
        error: {
            invalidTag: 'Tags must contain only upper and lower case letters, or underscores and must be non-empty'
        }
        });
        return;
    }
    next();
}

export {
  isTagExists,
  isValidTag
};
