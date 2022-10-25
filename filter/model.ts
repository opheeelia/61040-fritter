import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Filter
 * DO NOT implement operations here ---> use collection file
 */

export type Filter = {
  _id: Types.ObjectId;
  name: string;
  creatorId: Types.ObjectId;
  public: boolean;
  dateCreated: Date;
  include: Array<Array<any>>;
  // exclude: Array<Array<any>>;
};

const FilterSchema = new Schema<Filter>({
  name: {
    type: String,
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  public: {
    type: Boolean,
    default: true
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  include: {
    type: [Array]
  },
  // exclude: {
  //   type: [Array]
  // }
});

const FilterModel = model<Filter>('Filter', FilterSchema);
export default FilterModel;
