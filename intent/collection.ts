import type {HydratedDocument, Types} from 'mongoose';
import type {Intent} from './model';
import IntentModel from './model';

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
   * @param {string} intention - The intent supplement
   * @return {Promise<HydratedDocument<Intent>>} - The newly created intent
   */
  static async addOne(freetId: Types.ObjectId | string, intention: string, supplement?: string): Promise<HydratedDocument<Intent>> {
    const intent = new IntentModel({
      _id: freetId,
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
    return IntentModel.findOne({_id: freetId});
  }

  /**
   * Delete an intent with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const intent = await IntentModel.deleteOne({_id: freetId});
    return intent !== null;
  }
}

export default IntentCollection;
