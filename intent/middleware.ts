import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import IntentCollection from '../intent/collection';
import {IntentType} from './util';

/**
 * Checks if a freet with freetId is req.params exists
 */
 const isIntentNew = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const intent = validFormat ? await IntentCollection.findOne(req.params.freetId) : '';
  if (intent) {
    res.status(404).json({
      error: {
        intentNotFound: `Intent with freet ID ${req.params.freetId} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
 const isIntentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const intent = validFormat ? await IntentCollection.findOne(req.params.freetId) : '';
  if (!intent) {
    res.status(404).json({
      error: {
        intentNotFound: `Intent with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/*
 * Checks if the intent is a valid intent
 */
const isValidIntent = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req.body.intent in IntentType)) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks if the intent supplement is a valid link
 */
const isValidSupplement = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.supplement) {
    if (req.body.intent == IntentType.Inform) {
      res.status(400).json({
        error: {
          freetNotFound: 'Informing freets must be accompanied by a source link supplement.'
        }
      });
      return;
    }
    next();
    return;
  }

  const supplement = req.body.supplement;
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if (!pattern.test(supplement)) {
    res.status(400).json({
      error: 'Supplement must be a valid link.'
    });
    return;
  }

  next();
};

export {
  isIntentExists,
  isIntentNew,
  isValidSupplement,
  isValidIntent
};
