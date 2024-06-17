import {
  IBloodGlucoseRecord,
  IBloodPressureRecord,
  IBodyFatRecord,
  IBodyTemperatureRecord,
  IWaterMassRecord,
  IHeartRateRecord,
  IHeartRateVariabilityRmssdRecord,
  IHydrationRecord,
  IOxygenSaturationRecord,
  IRespiratoryRateRecord,
  IRestingHeartRateRecord,
  IVo2MaxRecord,
} from '../types/vitals';
import { UserVitalsModel } from '../models/vitals';


import { Response } from 'express';
import { IAuthRequest } from '../middlewares/auth';
import Joi from 'joi';

export const testVitals = async (req: IAuthRequest, res: Response) => {
  res.send('testing route');
};

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
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Vitals Records not found');
    }

    const bloodGlucoseRecords: IBloodGlucoseRecord[] = data.vitals.bloodGlucose;
    res.status(200).json(bloodGlucoseRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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
        console.error('Invalid Blood Glucose Record');
        throw new Error(error.details[0].message);
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
    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.bloodGlucose': { $each: newBloodGlucoseRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
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
  recordType: Joi.string().valid('BloodPressure').required(),
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
        console.error('Invalid Blood Pressure Record');
        throw new Error(error.details[0].message);
      }
    }

    const newBloodPressureRecords: IBloodPressureRecord[] = data.map(
      (record) => ({
        recordType: record.recordType,
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

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.bloodPressure': { $each: newBloodPressureRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
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
    const userID: string = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
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
        console.error('Invalid Body Fat Record');
        throw new Error(error.details[0].message);
      }
    }

    // create new body fat records
    const newBodyFatRecords: IBodyFatRecord[] = data.map((record) => ({
      time: new Date(record.time),
      percentage: record.percentage,
      recordType: record.recordType,
    }));

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.bodyFat': { $each: newBodyFatRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
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
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Body Fat Records not found');
    }

    const bodyFatRecords: IBodyFatRecord[] = data.vitals.bodyFat;
    return res.status(200).json(bodyFatRecords);
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
        console.error('Invalid Body Temperature Record');
        throw new Error(error.details[0].message);
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

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      {
        $push: {
          'vitals.bodyTemperature': { $each: newBodyTemperatureRecords },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
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
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Body Temperature Records not found');
    }

    const bodyTemperatureRecords: IBodyTemperatureRecord[] =
      data.vitals.bodyTemperature;

    return res.status(200).json(bodyTemperatureRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// water mass
const validateWaterMassRecord = Joi.object({
  recordType: Joi.string().valid('WaterMass').required(),
  time: Joi.date().required(),
  mass: Joi.object({
    value: Joi.number().required(),
    unit: Joi.string()
      .valid(
        'grams',
        'kilograms',
        'milligrams',
        'micrograms',
        'ounces',
        'pounds'
      )
      .required(),
  }),
});

// get Water Mass Records
export const getWaterMassRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID: string = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Water Mass Records not found');
    }

    const waterMassRecords: IWaterMassRecord[] = data.vitals.waterMass;
    return res.status(200).json(waterMassRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// create new Water Mass Records
export const newWaterMassRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID: string = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the records
    for (const record of data) {
      const { error } = validateWaterMassRecord.validate(record);
      if (error) {
        console.error('Invalid Water mass record');
        throw new Error(error.details[0].message);
      }
    }

    // create new water mass records
    const newWaterMassRecords: IWaterMassRecord[] = data.map((record) => {
      return {
        recordType: record.recordType,
        time: new Date(record.time),
        mass: {
          value: record.mass.value,
          unit: record.mass.unit,
        },
      };
    });

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.waterMass': { $each: newWaterMassRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating water mass records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// heart Rate records
const validateHeartRateRecord = Joi.object({
  recordType: Joi.string().valid('HeartRate').required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  samples: Joi.array().items(
    Joi.object({
      beatsPerMinute: Joi.number().required(),
      time: Joi.date().required(),
    }).required()
  ),
});

// get Heart Rate Records
export const getHeartRateRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID: string = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Heart Rate Records not found');
    }

    const heartRateRecords: IHeartRateRecord[] = data.vitals.heartRate;
    return res.status(200).json(heartRateRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// create new Heart Rate Records
export const newHeartRateRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID: string = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the records
    for (const record of data) {
      const { error } = validateHeartRateRecord.validate(record);
      if (error) {
        console.error('Invalid Heart Rate record');
        throw new Error(error.details[0].message);
      }
    }

    // create new heart rate records
    const newHeartRateRecords: IHeartRateRecord[] = data.map((record) => ({
      recordType: record.recordType,
      startTime: record.startTime,
      endTime: record.endTime,
      samples: record.samples,
    }));

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.heartRate': { $each: newHeartRateRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating heart rate records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// heart Rate Variability
const validateHeartRateVariabilityRecordSchema = Joi.object({
  recordType: Joi.string().valid('HeartRateVariability').required(),
  time: Joi.date().required(),
  heartRateVariabilityMillis: Joi.number().required(),
});

// get HeartRateVariability Records
export const getHeartRateVariabilityRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID: string = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Heart Rate Variability Records not found');
    }

    const heartRateVariabilityRecords: IHeartRateVariabilityRmssdRecord[] =
      data.vitals.heartRateVariability;
    return res.status(200).json(heartRateVariabilityRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// create new HeartRateVariability Records
export const newHeartRateVariabilityRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID: string = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // vlaidate the records
    for (const record of data) {
      const { error } =
        validateHeartRateVariabilityRecordSchema.validate(record);
      if (error) {
        console.error('Invalid Heart Rate Variability record');
        throw new Error(error.details[0].message);
      }
    }

    // create new Heart Rate Variability records
    const newHeartRateVariabilityRecords: IHeartRateVariabilityRmssdRecord[] =
      data.map((record) => {
        return {
          recordType: record.recordType,
          time: new Date(record.time),
          heartRateVariabilityMillis: record.heartRateVariabilityMillis,
        };
      });

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      {
        $push: {
          'vitals.heartRateVariability': {
            $each: newHeartRateVariabilityRecords,
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating heart rate variability records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// hydration record
const validateHydrationRecordSchema = Joi.object({
  recordType: Joi.string().valid('Hydration').required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  volume: Joi.object({
    value: Joi.number().required(),
    unit: Joi.string()
      .valid('liters', 'milliliters', 'fluidOuncesUs')
      .required(),
  }),
});

// TODO: Hydration Record not in vitals?
//
// get Hydration Records
export const getHydrationRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID: string = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Hydration Records not found');
    }

    const hydrationRecords: IHydrationRecord[] = data.vitals.hydration;
    return res.status(200).json(hydrationRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//
// create new Hydration Records
export const newHydrationRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateHydrationRecordSchema.validate(record);
      if (error) {
        console.error('Invalid Hydration record');
        throw new Error(error.details[0].message);
      }
    }

    // create new hydration records
    const newHydrationRecords: IHydrationRecord[] = data.map((record) => {
      return {
        recordType: record.recordType,
        startTime: record.startTime,
        endTime: record.endTime,
        volume: {
          value: record.volume.value,
          unit: record.volume.unit,
        },
      };
    });

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.hydrationRecord': { $each: newHydrationRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating hydration records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// oxygen saturation records
const validateOxygenSaturationRecordSchema = Joi.object({
  recordType: Joi.string().valid('OxygenSaturation').required(),
  time: Joi.date().required(),
  percentage: Joi.number().required(),
});

// get Oxygen Saturation Records
export const getOxygenSaturationRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Oxygen Saturation Records not found');
    }

    const oxygenSaturationRecords: IOxygenSaturationRecord[] =
      data.vitals.oxygenSaturation;
    return res.status(200).json(oxygenSaturationRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// create new Oxygen Saturation Records
export const newOxygenSaturationRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateOxygenSaturationRecordSchema.validate(record);
      if (error) {
        console.error('Invalid Oxygen Saturation Record');
        throw new Error(error.details[0].message);
      }
    }

    // create new oxygen saturation records
    const newOxygenSaturationRecords: IOxygenSaturationRecord[] = data.map(
      (record) => {
        return {
          recordType: record.recordType,
          time: new Date(record.time),
          percentage: record.percentage,
        };
      }
    );

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      {
        $push: {
          'vitals.oxygenSaturation': { $each: newOxygenSaturationRecords },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating oxygen saturation records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// respiratory Rate
const validateRespiratoryRateRecordsSchema = Joi.object({
  recordType: Joi.string().valid('RespiratoryRate').required(),
  time: Joi.date().required(),
  rate: Joi.number().required(),
});

// get Respiratory Rate Records
export const getRespiratoryRateRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Respiratory Rate Records not found');
    }

    const respiratoryRateRecords: IRespiratoryRateRecord[] =
      data.vitals.respiratoryRate;

    return res.status(200).json(respiratoryRateRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// create new Respiratory Rate Records
export const newRespiratoryRateRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateRespiratoryRateRecordsSchema.validate(record);
      if (error) {
        console.error('Invalid Respiratory Rate Record');
        throw new Error(error.details[0].message);
      }
    }

    // create new respiratory rate records
    const newRespiratoryRateRecords: IRespiratoryRateRecord[] = data.map(
      (record) => {
        return {
          recordType: record.recordType,
          time: new Date(record.time),
          rate: record.rate,
        };
      }
    );

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      {
        $push: {
          'vitals.respiratoryRate': { $each: newRespiratoryRateRecords },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating respiratory rate records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// resting Heart Rate
const validateRestingHeartRateRecordsSchema = Joi.object({
  recordType: Joi.string().valid('RestingHeartRate').required(),
  time: Joi.date().required(),
  beatsPerMinute: Joi.number().required(),
});

// get Resting Heart Rate Records
export const getRestingHeartRateRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Resting Heart Rate Records not found');
    }

    const restingHeartRateRecords: IRestingHeartRateRecord[] =
      data.vitals.restingHeartRate;

    return res.status(200).json(restingHeartRateRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// new Resting Heart Rate Records
export const newRestingHeartRateRecords = async (
  req: IAuthRequest,
  res: Response
) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateRestingHeartRateRecordsSchema.validate(record);
      if (error) {
        console.error('Invalid Resting Heart Rate Record');
        throw new Error(error.details[0].message);
      }
    }

    // create new resting heart rate records
    const newRestingHeartRateRecords: IRestingHeartRateRecord[] = data.map(
      (record) => {
        return {
          recordType: record.recordType,
          time: new Date(record.time),
          beatsPerMinute: record.beatsPerMinute,
        };
      }
    );

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      {
        $push: {
          'vitals.restingHeartRate': { $each: newRestingHeartRateRecords },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating resting heart rate records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Vo2 Max
const validateVo2MaxRecordsSchema = Joi.object({
  recordType: Joi.string().valid('Vo2Max').required(),
  time: Joi.date().required(),
  measurementMethod: Joi.number().required(),
  vo2MillilitersPerMinuteKilogram: Joi.number().required(),
});

// get Vo2 Max Records
export const getVo2MaxRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;
    const data = await UserVitalsModel.findOne({ user: userID });

    if (!data) {
      throw new Error('Vo2 Max Records not found');
    }

    const vo2MaxRecords: IVo2MaxRecord[] = data.vitals.vo2Max;

    return res.status(200).json(vo2MaxRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// new Vo2 Max Records
export const newVo2MaxRecords = async (req: IAuthRequest, res: Response) => {
  try {
    const userID = req.user?.userID;
    const data = Array.isArray(req.body) ? req.body : [req.body];

    // validate the data
    for (const record of data) {
      const { error } = validateVo2MaxRecordsSchema.validate(record);
      if (error) {
        console.error('Invalid Vo2 Max Record');
        throw new Error(error.details[0].message);
      }
    }

    // create new vo2 max records
    const newVo2MaxRecords: IVo2MaxRecord[] = data.map((record) => {
      return {
        recordType: record.recordType,
        time: new Date(record.time),
        measurementMethod: record.measurementMethod,
        vo2MillilitersPerMinuteKilogram: record.vo2MillilitersPerMinuteKilogram,
      };
    });

    const updatedVitals = await UserVitalsModel.findOneAndUpdate(
      { user: userID },
      { $push: { 'vitals.vo2Max': { $each: newVo2MaxRecords } } },
      { new: true, upsert: true }
    );

    if (!updatedVitals) {
      throw new Error('Error updating vo2 max records');
    }

    // succesfully pushed the records.
    return res.status(200).json({ message: 'Records added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
