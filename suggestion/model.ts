import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Suggestion
 * DO NOT implement operations here ---> use collection file
 */

// It is implied that the suggestion is created by the author of the freet 
export type Suggestion = {
  _id: Types.ObjectId;
  freetId: Types.ObjectId;
  suggestorId: Types.ObjectId;
  suggestion: string;
  suggestionType: string; // limited to the values of TODO
};

const SuggestionSchema = new Schema<Suggestion>({
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  suggestorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  suggestion: {
    type: String,
    required: true,
  },
  suggestionType: {
    type: String,
    required: true,
  }
});

const SuggestionModel = model<Suggestion>('Suggestion', SuggestionSchema);
export default SuggestionModel;
