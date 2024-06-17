import { Schema } from 'mongoose';
import { IRecord } from '../types/base';

// TODO: Checkout why we don't have Body Weight record


// Captures the user's lean body mass. Each record represents a single instantaneous measurement.
export interface ILeanBodyMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // implement LeanBodyMass in typescript
  mass: number;
}

export interface IBasalBodyTemperatureRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  temperature: number;
  measurementLocation: number;
}

export interface IBasalMetabolicRateRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  // look for how to implement the android comparable in typecript
  basalMetabolicRate: number;
}

export interface IBoneMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  mass: number;
}

export interface IHeightRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  height: number;
}

export interface IBodyMeasurement {
  user: Schema.Types.ObjectId;
  bodyMeasurement: {
    basalBodyTemperature: IBasalBodyTemperatureRecord[];
    basalMetabolicRate: IBasalMetabolicRateRecord[];
    boneMass: IBoneMassRecord[];
    height: IHeightRecord[];
    leanBodyMass: ILeanBodyMassRecord[];
  };
}
