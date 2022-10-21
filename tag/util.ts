import type {HydratedDocument} from 'mongoose';
import type {Tag} from '../tag/model';

type TagResponse = {
  _id: string;
  tagLabel: string;
  freetId: string;
};

/**
 * Transform a raw Tag object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Tag>} tag - An tag
 * @returns {TagResponse} - The tag object formatted for the frontend
 */
const constructTagResponse = (tag: HydratedDocument<Tag>): TagResponse => {
  const tagCopy: Tag = {
    ...tag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...tagCopy,
    _id: tagCopy._id.toString(),
    freetId: tagCopy.freetId.toString()
  };
};

export {
  constructTagResponse
};
