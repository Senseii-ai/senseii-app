import { Schema } from 'mongoose';
import { IRecord } from './base';

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

interface IWaterMass {
  value: number;
  unit:
  | 'grams'
  | 'kilograms'
  | 'milligrams'
  | 'micrograms'
  | 'ounces'
  | 'pounds';
}

export interface IVolume {
  value: number;
  unit: 'liters' | 'fluidOuncesUs' | 'milliliters';
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
  mass: IWaterMass;
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
  volume: IVolume;
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
    hydration: IHydrationRecord[];
    oxygenSaturation: IOxygenSaturationRecord[];
    respiratoryRate: IRespiratoryRateRecord[];
    restingHeartRate: IRestingHeartRateRecord[];
    vo2Max: IVo2MaxRecord[];
  };
}
