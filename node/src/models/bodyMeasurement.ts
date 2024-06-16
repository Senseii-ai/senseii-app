import { Schema } from 'mongoose';
import { IRecord } from '../types/base';

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

export const UserBodyMeasurementSchema = new Schema<IBodyMeasurement>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  bodyMeasurement: {
    weight: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      }
    ],
    basalBodyTemperature: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        temperature: { type: Number, required: true },
        measurementLocation: { type: Number, required: true },
      },
    ],

    basalMetabolicRate: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        basalMetabolicRate: { type: Number, required: true },
      },
    ],
    boneMass: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
    height: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        height: { type: Number, required: true },
      },
    ],
    leanBodyMass: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
  },
});
