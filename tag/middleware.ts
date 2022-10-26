import type {Request, Response, NextFunction} from 'express';
import TagCollection from '../tag/collection';

/**
 * Checks if freet tag combo exists
 */
const areTagsNew = async (req: Request, res: Response, next: NextFunction) => {
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
    areTagsNew,
    areValidTags
};
