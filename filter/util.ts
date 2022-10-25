import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Filter} from '../filter/model';

type FilterResponse = {
  _id: string;
  name: string;
  creatorId: string;
  public: boolean;
  dateCreated: string;
  include: Array<Array<string>>;
  // exclude: Array<Array<string>>;
};

enum FilterType {
  User,
  Tag,
  Intent,
  // Supplement
}

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Filter object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Filter>} filter - An filter
 * @returns {FilterResponse} - The filter object formatted for the frontend
 */
const constructFilterResponse = (filter: HydratedDocument<Filter>): FilterResponse => {
  const filterCopy: Filter = {
    ...filter.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...filterCopy,
    _id: filterCopy._id.toString(),
    creatorId: filterCopy.creatorId.toString(),
    dateCreated: formatDate(filter.dateCreated),
    include: filterCopy.include.map((arr) => arr.map((id) => id.toString())),
    // exclude: filterCopy.exclude.map((arr) => arr.map((id) => id.toString())),
  };
};

export {
  FilterType,
  constructFilterResponse
};
