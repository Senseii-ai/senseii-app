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
}

// Captures the body fat percentage of a user. Each record represents a person's total body fat as a percentage of their total body mass.
export interface IBodyFatRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BodyFatPercentage in typescript
  percentage: number;
}

// Captures the body temperature of a user. Each record represents a single instantaneous body temperature measurement.
export interface IBodyTemperatureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  temperature: number;
  measurementLocation: number;
}

// Captures the user's body water mass. Each record represents a single instantaneous measurement.
export interface IWaterMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement WaterMass in typescript
  mass: number;
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
}

// Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats.
export interface IHeartRateVariabilityRmssdRecord extends IRecord {
  time: Date;
  zoneOffSet?: number;
  heartRateVariabilityMillis: number;
}

// Captures how much water a user drank in a single drink.
export interface IHydrationRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  // implement Volume in typescript
  volume: number;
}

// Captures the amount of oxygen circulating in the blood, measured as a percentage of oxygen-saturated hemoglobin. Each record represents a single blood oxygen saturation reading at the time of measurement.
export interface IOxygenSaturationRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement OxygenSaturation in typescript
  percentage: number;
}

// Captures the user's respiratory rate. Each record represents a single instantaneous measurement.
export interface IRespiratoryRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  rate: number;
}

// Captures the user's resting heart rate. Each record represents a single instantaneous measurement.
export interface IRestingHeartRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  beatsPerMinute: number;
}

// Capture user's VO2 max score and optionally the measurement method.
export interface IVo2MaxRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement Vo2Max in typescript
  vo2MillilitersPerMinuteKilogram: number;
  measurementMethod: number;
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
        recordType: 'BloodGlucose',
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
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        systolic: { type: Number, required: true },
        diastolic: { type: Number, required: true },
        bodyPosition: { type: Number, required: true },
        measurementLocation: { type: Number, required: true },
      },
    ],
    bodyFat: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        percentage: { type: Number, required: true },
      },
    ],
    bodyTemperature: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        temperature: { type: Number, required: true },
        measurementLocation: { type: Number, required: true },
      },
    ],
    waterMass: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
    heartRate: [
      {
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
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        heartRateVariabilityMillis: { type: Number, required: true },
      },
    ],
    hydrationRecord: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        volume: { type: Number, required: true },
      },
    ],
    leanBodyMass: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
    oxygenSaturation: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        percentage: { type: Number, required: true },
      },
    ],
    respiratoryRate: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        rate: { type: Number, required: true },
      },
    ],
    restingHeartRate: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        beatsPerMinute: { type: Number, required: true },
      },
    ],
    vo2Max: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        vo2MillilitersPerMinuteKilogram: { type: Number, required: true },
        measurementMethod: { type: Number, required: true },
      },
    ],
  },
});

export const VitalModel = mongoose.model<IVitals>('Vitals', UserVitalsSchema);
