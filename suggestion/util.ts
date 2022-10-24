import type {HydratedDocument} from 'mongoose';
import type {Suggestion} from '../suggestion/model';

type SuggestionResponse = {
  _id: string;
  freetId: string;
  suggestorId: string;
  suggestion: string;
  suggestionType: SuggestionType; 
}

enum SuggestionType {
  Tag = "Tag",
  Intent = "Intent",
  Supplement = "Supplement"
}

/**
 * Transform a raw Suggestion object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Suggestion>} suggestion - An suggestion
 * @returns {SuggestionResponse} - The suggestion object formatted for the frontend
 */
const constructSuggestionResponse = (suggestion: HydratedDocument<Suggestion>): SuggestionResponse => {
  const suggestionCopy: Suggestion = {
    ...suggestion.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: suggestionCopy._id.toString(),
    freetId: suggestionCopy.freetId.toString(),
    suggestorId: suggestionCopy.suggestorId.toString(),
    suggestion: suggestionCopy.suggestion,
    suggestionType: suggestionCopy.suggestionType as SuggestionType,
  };
};

export {
  SuggestionType,
  constructSuggestionResponse
};
