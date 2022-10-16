import type {HydratedDocument} from 'mongoose';
import type {Intent} from '../intent/model';

type IntentResponse = {
  _id: string; // equal to the freetId
  intent: IntentType; // limmited to the values of "inform" "joke" ""
  supplement: string;
};

enum IntentType {
  Inform = "Inform",
  Joke = "Joke",
  Share = "Share",
}

/**
 * Transform a raw Intent object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Intent>} intent - An intent
 * @returns {IntentResponse} - The intent object formatted for the frontend
 */
const constructIntentResponse = (intent: HydratedDocument<Intent>): IntentResponse => {
  const intentCopy: Intent = {
    ...intent.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...intentCopy,
    _id: intentCopy._id.toString(),
    intent: intentCopy.intent as IntentType,
  };
};

export {
  IntentType,
  constructIntentResponse
};
