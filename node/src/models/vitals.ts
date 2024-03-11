import { IRecord } from './health';
import mongoose, { Schema } from 'mongoose';

export interface IBloodGlucose {
  value: number;
  unit: 'milligramsPerDeciliter' | 'millimolesPerLiter';
}

export interface IPressure {
  value: number;
  unit: 'millimetersOfMercury';
}

export interface ITemperature {
  value: number;
  unit: 'celsius' | 'fahrenheit';
}

// Captures the concentration of glucose in the blood. Each record represents a single instantaneous blood glucose reading.
export interface IBloodGlucoseRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BloodGlucoseUnit in typescript
  level: IBloodGlucose;
  mealType: number;
  specimenSource: number;
  relationToMeal: number;
  recordType: 'BloodGlucose';
}

// Captures the blood pressure of a user. Each record represents a single instantaneous blood pressure reading.
export interface IBloodPressureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  systolic: IPressure;
  diastolic: IPressure;
  bodyPosition: number;
  measurementLocation: number;
  recordType: 'BloodPressure';
}

// Captures the body fat percentage of a user. Each record represents a person's total body fat as a percentage of their total body mass.
export interface IBodyFatRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BodyFatPercentage in typescript
  percentage: number;
  recordType: 'BodyFat';
}

// Captures the body temperature of a user. Each record represents a single instantaneous body temperature measurement.
export interface IBodyTemperatureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  temperature: ITemperature;
  measurementLocation?: number;
  recordType: 'BodyTemperature';
}

// Captures the user's body water mass. Each record represents a single instantaneous measurement.
export interface IWaterMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement WaterMass in typescript
  mass: number;
  recordType: 'WaterMass';
}

// Represents a single measurement of the heart rate.
export interface IHeartRateRecordSample {
  time: Date;
  beatsPerMinute: number;
}

// Captures the user's heart rate. Each record represents a series of measurements.
export interface IHeartRateRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: IHeartRateRecordSample[];
  recordType: 'HeartRate';
}

// Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats.
export interface IHeartRateVariabilityRmssdRecord extends IRecord {
  time: Date;
  zoneOffSet?: number;
  heartRateVariabilityMillis: number;
  recordType: 'HeartRateVariabilityRmssd';
}

// Captures how much water a user drank in a single drink.
export interface IHydrationRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  // implement Volume in typescript
  volume: number;
  recordType: 'Hydration';
}

// Captures the amount of oxygen circulating in the blood, measured as a percentage of oxygen-saturated hemoglobin. Each record represents a single blood oxygen saturation reading at the time of measurement.
export interface IOxygenSaturationRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement OxygenSaturation in typescript
  percentage: number;
  recordType: 'OxygenSaturation';
}

// Captures the user's respiratory rate. Each record represents a single instantaneous measurement.
export interface IRespiratoryRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  rate: number;
  recordType: 'RespiratoryRate';
}

// Captures the user's resting heart rate. Each record represents a single instantaneous measurement.
export interface IRestingHeartRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  beatsPerMinute: number;
  recordType: 'RestingHeartRate';
}

// Capture user's VO2 max score and optionally the measurement method.
export interface IVo2MaxRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement Vo2Max in typescript
  vo2MillilitersPerMinuteKilogram: number;
  measurementMethod: number;
  recordType: 'Vo2Max';
}

export interface IVitals {
  user: Schema.Types.ObjectId;
  vitals: {
    bloodGlucose: IBloodGlucoseRecord[];
    bloodPressure: IBloodPressureRecord[];
    bodyFat: IBodyFatRecord[];
    bodyTemperature: IBodyTemperatureRecord[];
    waterMass: IWaterMassRecord[];
    heartRate: IHeartRateRecord[];
    heartRateVariability: IHeartRateVariabilityRmssdRecord[];
    hydrationRecord: IHydrationRecord[];
    oxygenSaturation: IOxygenSaturationRecord[];
    respiratoryRate: IRespiratoryRateRecord[];
    restingHeartRate: IRestingHeartRateRecord[];
    vo2Max: IVo2MaxRecord[];
  };
}

export const UserVitalsSchema = new Schema<IVitals>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  vitals: {
    bloodGlucose: [
      {
        recordType: { type: String, required: true, default: 'BloodGlucose' },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        level: {
          value: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
            enum: ['milligramsPerDeciliter', 'millimolesPerLiter'],
            required: true,
          },
        },
        mealType: { type: Number, required: true },
        specimenSource: { type: Number, required: true },
        relationToMeal: { type: Number, required: true },
      },
    ],
    bloodPressure: [
      {
        recordType: { type: String, required: true, default: 'BloodPressure' },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        systolic: {
          value: { type: Number, required: true },
          unit: {
            type: String,
            enum: ['millimetersOfMercury'],
            required: true,
          },
        },
        diastolic: {
          value: { type: Number, required: true },
          unit: {
            type: String,
            enum: ['millimetersOfMercury'],
            required: true,
          },
        },
        bodyPosition: { type: Number, required: true },
        measurementLocation: { type: Number, required: true },
      },
    ],
    bodyFat: [
      {
        recordType: { type: String, required: true, default: 'BodyFat' },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        percentage: { type: Number, required: true },
      },
    ],
    bodyTemperature: [
      {
        recordType: {
          type: String,
          required: true,
          default: 'BodyTemperature',
        },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        temperature: {
          value: { type: Number, required: true },
          unit: {
            type: String,
            enum: ['celsius', 'fahrenheit'],
            required: true,
          },
        },
        measurementLocation: { type: Number },
      },
    ],
    waterMass: [
      {
        recordType: { type: String, required: true, default: 'WaterMass' },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
    heartRate: [
      {
        recordType: { type: String, required: true, default: 'HeartRate' },
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        samples: [
          {
            time: { type: Date, required: true },
            beatsPerMinute: { type: Number, required: true },
          },
        ],
      },
    ],
    heartRateVariability: [
      {
        recordType: {
          type: String,
          required: true,
          default: 'HeartRateVariabilityRmssd',
        },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        heartRateVariabilityMillis: { type: Number, required: true },
      },
    ],
    hydrationRecord: [
      {
        recordType: { type: String, required: true, default: 'Hydration' },
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        volume: { type: Number, required: true },
      },
    ],
    oxygenSaturation: [
      {
        recordType: {
          type: String,
          required: true,
          default: 'OxygenSaturation',
        },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        percentage: { type: Number, required: true },
      },
    ],
    respiratoryRate: [
      {
        recordType: {
          type: String,
          required: true,
          default: 'RespiratoryRate',
        },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        rate: { type: Number, required: true },
      },
    ],
    restingHeartRate: [
      {
        recordType: {
          type: String,
          required: true,
          default: 'RestingHeartRate',
        },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        beatsPerMinute: { type: Number, required: true },
      },
    ],
    vo2Max: [
      {
        recordType: { type: String, required: true, default: 'Vo2Max' },
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        vo2MillilitersPerMinuteKilogram: { type: Number, required: true },
        measurementMethod: { type: Number, required: true },
      },
    ],
  },
});

export const VitalModel = mongoose.model<IVitals>('Vitals', UserVitalsSchema);
