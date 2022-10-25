import { Freet } from 'freet/model';
import type {HydratedDocument, Types} from 'mongoose';
import type {Intent} from './model';
import IntentModel from './model';
import { IntentType } from './util';

/**
 * This files contains a class that has the functionality to explore intents
 * stored in MongoDB, including adding, finding, updating, and deleting intents.
 * Feel free to add additional operations in this file.
 *
 */
class IntentCollection {
  /**
   * Add an intent to the collection
   *
   * @param {string} freetId - The id of the freet
   * @param {string} intention - The intent
   * @param {string} supplement - The intent supplement
   * @return {Promise<HydratedDocument<Intent>>} - The newly created intent
   */
  static async addOne(freetId: Types.ObjectId | string, intention: string, supplement?: string): Promise<HydratedDocument<Intent>> {
    const intent = new IntentModel({
      freetId: freetId,
      intent: intention
    });
    if (supplement != null) {
      intent.supplement = supplement
    }
    await intent.save();
    return intent;
  }

  /**
   * Find the intent of a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Intent>> | Promise<null> } - The freet with the given freetId, if any
   */
    static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Intent>> {
    return await IntentModel.findOne({freetId: freetId});
  }

  /**
   * Delete an intent with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const intent = await IntentModel.deleteOne({freetId: freetId});
    return intent !== null;
  }

  /**
   * Get all the freets in with the intent
   *
   * @param {string} intent - The intent of the freets 
   * @return {Promise<Freet>[]>} - An array of all of the freets
   */
  static async findFreetsWithIntent(intent: string): Promise<Array<Freet>> {
    // Retrieves freets and sorts them from most to least recent
    const intents = await IntentModel.find({intent: intent as IntentType}).populate('freetId').sort({dateCreated: -1});
    return intents.map((intent) => {
      return intent.freetId as object as Freet;
    });
  }
}

export default IntentCollection;
