import { VitalModel, IVitals, IBloodGlucoseRecord } from '../models/vitals';
import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from '../middlewares/auth';
import Joi from 'joi';

// validate the records on runtime
const bloodGlucoseRecordSchema = Joi.object({
  time: Joi.date().required(),
  level: Joi.object({
    value: Joi.number().required(),
    unit: Joi.string().valid('milligramsPerDeciliter', 'millimolesPerLiter'),
  }),
  mealType: Joi.number().required(),
  specimenSource: Joi.number().required(),
  relationToMeal: Joi.number().required(),
  recordType: Joi.string().valid('BloodGlucose').required(),
});

// getBloodGlucoseRecords
export const getBloodGlucoseRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await VitalModel.findOne({ user: userID });

    if (!data) {
      res.status(404).json({ message: 'Records not Found' });
      throw new Error('Vitals Records not found');
    }

    const bloodGlucoseRecords: IBloodGlucoseRecord[] = data.vitals.bloodGlucose;
    res.status(200).json(bloodGlucoseRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// newBloodGlucoseRecords (array of records)
export const newBloodGlucoseRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const user = req.user;
    const userID = user?.userID;

    // check if data sent is an array, if not, conver to array.
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // verify is the object is valid using the schema
    for (const record of data) {
      const { error } = bloodGlucoseRecordSchema.validate(record);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    }

    // create new blood glucose records
    const newBloodGlucoseRecords: IBloodGlucoseRecord[] = data.map((record) => {
      return {
        time: new Date(record.time),
        level: {
          value: record.level.value,
          unit: record.level.unit,
        },
        metaData: record.metaData,
        mealType: record.mealType,
        specimenSource: record.specimenSource,
        relationToMeal: record.relationToMeal,
        recordType: record.recordType,
      };
    });

    // update the user's blood glucose records in one go.
    const updatedVitals = await VitalModel.findOneAndUpdate(
      { user: userID },
      { $push: { bloodGlucose: { $each: newBloodGlucoseRecords } } },
      { new: true }
    );

    if (!updatedVitals) {
      res.status(404).send({ message: 'Record not found' });
      throw new Error('Error updating blood glucose records');
    }

    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res;
  }
};
