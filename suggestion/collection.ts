import {HydratedDocument, Types} from 'mongoose';
import type {Suggestion} from './model';
import type {Freet} from '../freet/model';
import SuggestionModel from './model';
import FreetModel from '../freet/model';
import { SuggestionType } from './util';

/**
 * This files contains a class that has the functionality to explore suggestions
 * stored in MongoDB, including adding, finding, updating, and deleting suggestions.
 * Feel free to add additional operations in this file.
 *
 */
class SuggestionCollection {

  /**
   * Add suggestion to a freet
   *
   * @param {string} suggestion - Suggestion content
   * @param {string} suggestionType - Suggestion type
   * @param {string} freetId - The id of the freet to give this suggestion
   * @param {string} suggestorId - The id of the user giving this suggestion
   * @return {Promise<HydratedDocument<Suggestion>>} - The newly created suggestion
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
   * Find suggestion by user and type
   * 
   * @param {string} suggestion - Suggestion content
   * @param {string} suggestionType - Suggestion type
   * @param {string} freetId - The id of the freet to give this suggestion
   * @param {string} suggestorId - The id of the user giving this suggestion
   * @return {Promise<HydratedDocument<Suggestion>>  | Promise<null>} - The suggestion if exists
   */
  static async findOne(suggestion: string, suggestionType: string, suggestorId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Suggestion>> {
    return await SuggestionModel.findOne({suggestion, suggestionType, suggestorId, freetId});
  }

  /**
   * Find suggestion by id
   * 
   * @param {string} suggestionId - Suggestion id
   * @return {Promise<HydratedDocument<Suggestion>>  | Promise<null>} - The suggestion if exists
   */
  static async findOneById(suggestionId: string | Types.ObjectId): Promise<HydratedDocument<Suggestion>> {
    return await SuggestionModel.findOne({_id: suggestionId});
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


  /**
   * Get all the freets in with the suggestion
   *
   * @param {string} suggestion - The suggestion
   * @param {string} suggestionType - The suggestion type
   * @return {Promise<Freet[]>} - An array of all of the freets
   */
   static async findFreetsWithSuggestion(suggestion: string, suggestionType: string): Promise<Array<Freet>> {
    // Retrieves freets and sorts them from most to least recent
    const suggestions = await SuggestionModel.find({
      suggestion: suggestion,
      suggestionType: suggestionType as SuggestionType
    }).populate('freetId').sort({dateCreated: -1});
    return suggestions.map((suggestion) => {
      return suggestion.freetId as object as Freet;
    });
  }

}

export default SuggestionCollection;
