import {
  VitalModel,
  IBloodGlucoseRecord,
  IBloodPressureRecord,
  IBodyFatRecord,
  IBodyTemperatureRecord,
} from '../models/vitals';
import { Response } from 'express';
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
        res.status(400).json({ message: error.details[0].message });
        throw new Error('Invalid Blood Glucose Record');
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
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// validate the bloodPressure records on runtime
const validateBloodPressureRecordSchema = Joi.object({
  time: Joi.date().required(),
  systolic: {
    value: Joi.number().required(),
    unit: Joi.string().valid('millimetersOfMercury'),
  },
  diastolic: {
    value: Joi.number().required(),
    unit: Joi.string().valid('millimetersOfMercury'),
  },
  bodyPosition: Joi.number().required(),
  measurementLocation: Joi.number().required(),
});

// newBloodPressureRecords
export const newBloodPressureRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the records
    for (const record of data) {
      const { error } = validateBloodPressureRecordSchema.validate(record);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        throw new Error('Invalid Blood Pressure Record');
      }
    }

    const newBloodPressureRecords: IBloodPressureRecord[] = data.map(
      (record) => ({
        time: new Date(record.time),
        systolic: {
          value: record.systolic.value,
          unit: record.systolic.unit,
        },
        diastolic: {
          value: record.diastolic.value,
          unit: record.diastolic.unit,
        },
        bodyPosition: record.bodyPosition,
        measurementLocation: record.measurementLocation,
      })
    );

    const updatedVitals = await VitalModel.findOneAndUpdate(
      { user: userID },
      { $push: { bloodPressure: { $each: newBloodPressureRecords } } }
    );

    if (!updatedVitals) {
      res.status(404).json({ message: 'Record not found' });
      throw new Error('Error updating blood pressure records');
    }

    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBloodPressureRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await VitalModel.findOne({ user: userID });

    if (!data) {
      res.status(404).json({ message: 'Records not Found' });
      throw new Error('Blood Pressure Records not found');
    }

    const bloodPressureRecords: IBloodPressureRecord[] =
      data.vitals.bloodPressure;
    res.status(200).json(bloodPressureRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const validateBodyFatRecordSchema = Joi.object({
  time: Joi.date().required(),
  percentage: Joi.number().required(),
  recordType: Joi.string().valid('BodyFat').required(),
});

export const newBodyFatRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateBodyFatRecordSchema.validate(record);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        throw new Error('Invalid Body Fat Record');
      }
    }

    // create new body fat records
    const newBodyFatRecords: IBodyFatRecord[] = data.map((record) => ({
      time: new Date(record.time),
      percentage: record.percentage,
      recordType: record.recordType,
    }));

    const updatedVitals = await VitalModel.findOneAndUpdate(
      { user: userID },
      { $push: { bodyFat: { $each: newBodyFatRecords } } },
      { new: true }
    );

    if (!updatedVitals) {
      res.status(404).json({ message: 'Record not found' });
      throw new Error('Error updating body fat records');
    }

    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBodyFatRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;
    const data = await VitalModel.findOne({ user: userID });

    if (!data) {
      res.status(404).json({ message: 'Records not Found' });
      throw new Error('Body Fat Records not found');
    }

    const bodyFatRecords: IBodyFatRecord[] = data.vitals.bodyFat;
    res.status(200).json(bodyFatRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// body temperature

const validateBodyTemperatureRecordSchema = Joi.object({
  time: Joi.date().required(),
  temperature: Joi.object({
    value: Joi.number().required(),
    unit: Joi.string().valid('celsius', 'fahrenheit'),
  }),
  measurementLocation: Joi.number().optional(),
  recordType: Joi.string().valid('BodyTemperature').required(),
});

export const newBodyTemperatureRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateBodyTemperatureRecordSchema.validate(record);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        throw new Error('Invalid Body Temperature Record');
      }
    }

    // create new body temperature records
    const newBodyTemperatureRecords: IBodyTemperatureRecord[] = data.map(
      (record) => ({
        time: new Date(record.time),
        temperature: {
          value: record.temperature.value,
          unit: record.temperature.unit,
        },
        measurementLocation: record.measurementLocation,
        recordType: record.recordType,
      })
    );

    const updatedVitals = await VitalModel.findOneAndUpdate(
      { user: userID },
      { $push: { bodyTemperature: { $each: newBodyTemperatureRecords } } },
      { new: true }
    );

    if (!updatedVitals) {
      res.status(404).json({ message: 'Record not found' });
      throw new Error('Error updating body temperature records');
    }

    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBodyTemperatureRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await VitalModel.findOne({ user: userID });

    if (!data) {
      res.status(404).json({ message: 'Records not Found' });
      throw new Error('Body Temperature Records not found');
    }

    const bodyTemperatureRecords: IBodyTemperatureRecord[] =
      data.vitals.bodyTemperature;

    res.status(200).json(bodyTemperatureRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
