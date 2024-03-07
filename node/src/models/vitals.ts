import { IRecord } from './health';

export interface IBloodGlucoseRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BloodGlucoseUnit in typescript
  level: number;
  mealType: number;
  specimenSource: number;
  relationToMeal: number;
}

export interface IBloodPressureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  systolic: number;
  diastolic: number;
  bodyPosition: number;
  measurementLocation: number;
}

export interface IBodyFatRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement BodyFatPercentage in typescript
  percentage: number;
}

export interface IBodyTemperatureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  temperature: number;
  measurementLocation: number;
}

export interface IWaterMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement WaterMass in typescript
  mass: number;
}

export interface IHeartRateRecordSample {
  time: Date;
  beatsPerMinute: number;
}

export interface IHeartRateRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: IHeartRateRecordSample[];
}

export interface IHeartRateVariabilityRmssdRecord extends IRecord {
  time: Date;
  zoneOffSet?: number;
  heartRateVariabilityMillis: number;
}

export interface IHydrationRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  // implement Volume in typescript
  volume: number;
}

export interface ILeanBodyMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement LeanBodyMass in typescript
  mass: number;
}

export interface IOxygenSaturationRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement OxygenSaturation in typescript
  percentage: number;
}

export interface IRespiratoryRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  rate: number;
}

export interface IRestingHeartRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  beatsPerMinute: number;
}

export interface IVo2MaxRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement Vo2Max in typescript
  vo2MillilitersPerMinuteKilogram: number;
  measurementMethod: number;
}
