import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Tag
 * DO NOT implement operations here ---> use collection file
 */

// It is implied that the tag is created by the author of the freet 
export type Tag = {
  _id: Types.ObjectId;
  tagLabel: string;
  freetId: Types.ObjectId;
};

const TagSchema = new Schema<Tag>({
  tagLabel: {
    type: String,
    required: true
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;
