import { IRecord } from './health';

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
