import {HydratedDocument, trusted, Types} from 'mongoose';
import type {Filter} from './model';
import type {Freet} from '../freet/model';
import FilterModel from './model';
import FreetModel from '../freet/model';

/**
 * This files contains a class that has the functionality to explore filters
 * stored in MongoDB, including adding, finding, updating, and deleting filters.
 * Feel free to add additional operations in this file.
 *
 */
class FilterCollection {

  /**
   * Create a filter
   * 
   * @param {string} filterName - Filter name
   * @param {string} creatorId - user id of the creator 
   * @param {boolean} public - Whether filter is available to the public 
   * @param {string[][]} include - List of id's to include
   * @param {string[][]} exclude - List of id's to exclude
   * @return {Promise<HydratedDocument<Filter>>} - The newly created filter
   */
  static async addOne(filterName: string, creatorId: Types.ObjectId | string, publicFilter: boolean, include: string[][], exclude: string[][]): Promise<HydratedDocument<Filter>> {
    const date = new Date();
    const filterEntry = new FilterModel({
      creatorId: creatorId,
      name: filterName,
      public: publicFilter,
      dateCreated: date,
      include: include,
      exclude: exclude
    });

    await filterEntry.save();
    return filterEntry;
  }

  /**
   * Find filter by id
   * 
   * @param {string} filterId - Filter id
   * @return {Promise<HydratedDocument<Filter>> | Promise<null>} - The filter if exists
   */
  static async findOne(filterId: string | Types.ObjectId): Promise<HydratedDocument<Filter>> {
    return await FilterModel.findOne({_id: filterId});
  }

  /**
   * Find filter by name
   * 
   * @param {string?} prefix - Filter name prefix
   * @param {string} userId - User ID
   * @return {Promise<HydratedDocument<Filter>> | Promise<null>} - The filter if exists
   */
  static async findByName(prefix: string, userId: string | Types.ObjectId): Promise<Array<HydratedDocument<Filter>>> {
    var availableFilters = await FilterModel.aggregate([{$match: {name: {$regex: `${prefix}.*`}, public: true}}]);
    var personalFilters = await FilterModel.aggregate([{$match: {name: {$regex: `${prefix}.*`}, public: false, creatorId: userId}}]);
    availableFilters.push(...personalFilters);
    return availableFilters;
  }

  /**
   * Find filter by user
   * 
   * @param {string} userId - User ID
   * @return {Promise<HydratedDocument<Filter>> | Promise<null>} - The filter if exists
   */
  static async findByUser(userId: string | Types.ObjectId): Promise<Array<HydratedDocument<Filter>>> {
    return await FilterModel.find({creatorId: userId});
  }
  
  /**
   * Delete a filter with given id.
   *
   * @param {string} filterId - The id of the filter to delete
   * @return {Promise<Boolean>} - true if the filter has been deleted, false otherwise
   */
  static async deleteOne(filterId: Types.ObjectId | string): Promise<boolean> {
    const filter = await FilterModel.deleteOne({_id: filterId});
    return filter !== null;
  }
  
  // /**
  //  * Apply filter to posts, sort by most recent. 
  //  * 
  //  * @param {string?} filterId - Filter id
  //  * @return {Promise<HydratedDocument<Filter>> | Promise<null>} - The filter if exists
  //  */
  // static async applyFilter(filterId: string | Types.ObjectId): Promise<Array<HydratedDocument<Freet>>> {
  //   const filter = await FilterModel.findOne({_id: filterId});
  //   filter.include.forEach((arr, i) => {
  //     filter.exclude[i]
  //   });
  //   var posts = await FreetModel.aggregate([{$match: {}}]).sort({dateCreated: -1});
  //   return posts;
  // }

}

export default FilterCollection;
