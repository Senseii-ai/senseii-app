import mongoose, { Schema, Types, Document } from 'mongoose';

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

interface IEnergy {
  calories?: number;
  kiloCalories: number;
  joules: number;
  kiloJoules: number;
}

interface ITimeMeta {
  startTime: Date;
  endTime: Date;
  startTimeZoneOffset?: number;
  endZoneOffset?: number;
}

export interface IActiveCaloriesBurnedRecord extends IRecord {
  timeMeta: ITimeMeta;
  energy: IEnergy;
}

export interface ICyclingPedalingCadenceRecordSample {
  time: Date;
  revolutionPerMinute: number;
}

export interface ICyclingPedalingCadenceRecord extends IRecord {
  timeMeta: ITimeMeta;
  samples: ICyclingPedalingCadenceRecordSample[];
}

export interface ILength {
  feet?: number;
  inches?: number;
  kilometer: number;
  meters: number;
  miles?: number;
}

export interface IDistanceRecord extends IRecord {
  timeMeta: ITimeMeta;
  distance: ILength;
}

export interface IELevationGainedRecord extends IRecord {
  timeMeta: ITimeMeta;
  elevation: ILength;
}

export interface IExerciseSessionRecord extends IRecord {
  timeMeta: ITimeMeta;
  length?: ILength;
}

export interface IExerciseSegment {
  timeMeta: ITimeMeta;
  segmentType: number;
  repititions: number;
}

export interface IExerciseSessionRecord extends IRecord {}

// [TODO] handle Exercise Route interface

// const testData: IActiveCaloriesBurnedRecord = {
//   metaDate: {
//     clientId: '1234',
//     dataOrigin: String(Date.now()),
//     lastModifiedTime: new Date(),
//     clientRecordId: '12345',
//     clientRecordVersion: 4,
//     device: {
//       type: 2,
//     },
//     recordingMethod: 4,
//   },
//   timeMeta: {
//     startTime: new Date(),
//     endTime: new Date(),
//   },
//   energy: {
//     KiloCalories: 20,
//     KiloJoules: 20,
//     Joules: 20,
//   },
// };
