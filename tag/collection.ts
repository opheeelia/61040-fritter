import {HydratedDocument, Types} from 'mongoose';
import type {Tag} from './model';
import type {Freet} from '../freet/model';
import TagModel from './model';
import FreetModel from '../freet/model';

/**
 * This files contains a class that has the functionality to explore tags
 * stored in MongoDB, including adding, finding, updating, and deleting tags.
 * Feel free to add additional operations in this file.
 *
 */
class TagCollection {

  /**
   * Add a tag to a freet
   *
   * @param {string} tagLabels - The tags to add
   * @param {string} freetId - The id of the freet to give this tag
   * @return {Promise<Array<HydratedDocument<Tag>>>} - The newly created tags
   */
  static async addAll(tagLabels: string[], freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Tag>>> {
    return await TagModel.create(tagLabels.map((tagLabel) => ({tagLabel, freetId})));
  }

  /**
   * Find a specific tag freet pair
   */
  static async findOne(tagLabel: string, freetId: string): Promise<HydratedDocument<Tag>> {
    return await TagModel.findOne({tagLabel, freetId});
  }

  /**
   * Get the top X most popular labels sorted
   */
  static async findAllLabels(prefix: string): Promise<Array<HydratedDocument<Tag>>> {
    // return TagModel.aggregate([{"$group":{_id:"$tagLabel", count:{$sum:1}}}]);
    return await TagModel.aggregate([{$match: {tagLabel: {$regex: `${prefix}.*`}}}, {$sortByCount: "$tagLabel"}]);
  }

  /**
   * Get all tag to freet mappings
   */
  static async findAllTagEntries(): Promise<Array<HydratedDocument<Tag>>> {
    return await TagModel.find({});
  }

  // WIP
  // /**
  //  * Get all the freets in with the tag
  //  *
  //  * @param {string} tagLabel - The tag of the freets 
  //  * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
  //  */
  // static async findFreetsLabeledBy(tagLabel: string): Promise<Array<HydratedDocument<Freet>>> {
  //   // Retrieves freets and sorts them from most to least recent
  //   TagModel.aggregate([{$match: {tagLabel: tagLabel}}, {}])
  //   const tag = await FreetModel.find({tagLabel: tagLabel}).sort({dateModified: -1});
  //   return tag;
  // }

}

export default TagCollection;
