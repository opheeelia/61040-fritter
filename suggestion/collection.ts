import {HydratedDocument, Types} from 'mongoose';
import type {Suggestion} from './model';
import type {Freet} from '../freet/model';
import SuggestionModel from './model';
import FreetModel from '../freet/model';

/**
 * This files contains a class that has the functionality to explore suggestions
 * stored in MongoDB, including adding, finding, updating, and deleting suggestions.
 * Feel free to add additional operations in this file.
 *
 */
class SuggestionCollection {

  /**
   * Add suggestion(s) to a freet
   *
   * @param {string} suggestion - Suggestion content
   * @param {string} suggestionType - Suggestion type
   * @param {string} freetId - The id of the freet to give this suggestion
   * @param {string} suggestorId - The id of the user giving this suggestion
   * @return {Promise<HydratedDocument<Suggestion>>} - The newly created suggestions
   */
  static async addOne(suggestion: string, suggestionType: string, freetId: Types.ObjectId | string, suggestorId: Types.ObjectId | string): Promise<HydratedDocument<Suggestion>> {
    const suggestionEntry = new SuggestionModel({
      suggestion, 
      suggestionType,
      freetId,
      suggestorId
    });

    await suggestionEntry.save();
    return suggestionEntry;
  }

  /**
   * Find all suggestions for a freet by a user
   */
  static async findAllBySuggestor(suggestorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Suggestion>>> {
    return await SuggestionModel.find({suggestorId, freetId});
  }

  /**
   * Get the top X most popular suggestions for a freet for a specific type
   */
  static async findAllByType(suggestionType: string, freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Suggestion>>> {
    // return SuggestionModel.aggregate([{$match: {suggestionType}}, {"$group":{_id:"$suggestion", count:{$sum:1}}}]);
    return await SuggestionModel.aggregate([{$match: {suggestionType, freetId}}, {$sortByCount: "$suggestion"}]);
  }

  /**
   * Delete a suggestion with given id.
   *
   * @param {string} suggestionId - The id of the suggestion to delete
   * @return {Promise<Boolean>} - true if the suggestion has been deleted, false otherwise
   */
   static async deleteOne(suggestionId: Types.ObjectId | string): Promise<boolean> {
    const suggestion = await SuggestionModel.deleteOne({_id: suggestionId});
    return suggestion !== null;
  }

}

export default SuggestionCollection;
