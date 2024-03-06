export interface IDevice {
  manufacturer?: string;
  model?: string;
  type: number;
}

export interface IMetaData {
  clientId: string;
  dataOrigin: string;
  lastModifiedTime: Date;
  clientRecordId?: string;
  clientRecordVersion: number;
  device?: IDevice;
  recordingMethod: number;
}

export interface IRecord {
  metaDate: IMetaData;
}

export interface ITimeMeta {
  startTime: Date;
  endTime: Date;
  startTimeZoneOffset?: number;
  endZoneOffset?: number;
}

export interface IEnergy {
  calories?: number;
  kiloCalories: number;
  joules: number;
  kiloJoules: number;
}

export interface ICyclingPedalingCadenceRecordSample {
  time: Date;
  revolutionPerMinute: number;
}

export interface ILength {
  feet?: number;
  inches?: number;
  kilometer: number;
  meters: number;
  miles?: number;
}
