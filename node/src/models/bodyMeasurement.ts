import { IRecord, ITimeMeta, IMetaData, IDevice } from './main';

const BodyTemperatureMesaurementLocation = {};

export interface BasalBodyTemperatureRecord extends IRecord {
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

export interface ILeanBodyMassRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  mass: number;
}

// -------------------------------------------------------
export interface IHeartRateRecordSample {
  time: Date;
  beatsPerMinute: number;
}

export interface IHEartRateRecord extends IRecord {
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

export interface IHeightRecord extends IRecord {
  time: Date;
  zoneOffset?: number;
  height: number;
}

export interface IHydrationRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  volume: number;
}
