import { IRecord } from './health';
import { Schema } from 'mongoose';

// Captures the concentration of glucose in the blood. Each record represents a single instantaneous blood glucose reading.
export interface IBloodGlucoseRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BloodGlucoseUnit in typescript
  level: number;
  mealType: number;
  specimenSource: number;
  relationToMeal: number;
}

// Captures the blood pressure of a user. Each record represents a single instantaneous blood pressure reading.
export interface IBloodPressureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  systolic: number;
  diastolic: number;
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

// Captures the user's lean body mass. Each record represents a single instantaneous measurement.
export interface ILeanBodyMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement LeanBodyMass in typescript
  mass: number;
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
