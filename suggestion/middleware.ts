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
const doTagsExist = async (req: Request, res: Response, next: NextFunction) => {
    for (let tagLabel of req.body.tagLabels){
        const tag = await TagCollection.findOne(tagLabel, req.params.freetId);
        if (tag) {
            res.status(400).json({
            error: {
                tagAlreadyxists: `Tag ${tagLabel} with freet ID ${req.params.freetId} already exists.`
            }
            });
            return;
        }
    }

    next();
};

/**
 * Checks if the tag is a valid
 */
const areValidTags = (req: Request, res: Response, next: NextFunction) => {
    for (let tagLabel of req.body.tagLabels){
        const pattern = new RegExp("^[\\w]+$");
        if (!pattern.test(tagLabel)) {
            res.status(400).json({
            error: {
                invalidTag: 'Tags must contain only upper and lower case letters, or underscores and must be non-empty'
            }
            });
            return;
        }
    }
    next();
}

export {
    doTagsExist,
    areValidTags
};
