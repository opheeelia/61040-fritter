import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Intent
 * DO NOT implement operations here ---> use collection file
 */

// It is implied that the intent is created by the author of the freet 
export type Intent = {
  _id: Types.ObjectId;
  freetId: Types.ObjectId;
  intent: string; // limmited to the values of "inform" "joke" ""
  supplement: string;
};

const IntentSchema = new Schema<Intent>({
  // The intent of the freet
  freetId: {
    type: Schema.Types.ObjectId, 
    ref: 'Freet',
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  // Optional supplement to intent of the freet
  supplement: {
    type: String,
    required: false,
  }
});

const IntentModel = model<Intent>('Intent', IntentSchema);
export default IntentModel;
