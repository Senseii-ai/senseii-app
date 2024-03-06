import mongoose, { Schema, Types, Document } from 'mongoose';
import {
  IRecord,
  IEnergy,
  ICyclingPedalingCadenceRecordSample,
  ILength,
} from './main';

export interface IActiveCaloriesBurnedRecord extends IRecord {
  startTime: Date;
  startZoneOffset: number;
  endTime: Date;
  endZoneOffset: number;
  energy: IEnergy;
}

export interface ICyclingPedalingCadenceRecord extends IRecord {
  startTime: Date;
  startZoneOffset: number;
  endTime: Date;
  endZoneOffset: number;
  samples: ICyclingPedalingCadenceRecordSample[];
}

export interface IDistanceRecord extends IRecord {
  startTime: Date;
  startZoneOffset: number;
  endTime: Date;
  endZoneOffset: number;
  distance: ILength;
}

export interface IELevationGainedRecord extends IRecord {
  startTime: Date;
  startZoneOffset: number;
  endTime: Date;
  endZoneOffset: number;
  elevation: ILength;
}

export interface IExerciseLap {
  startTime: Date;
  endTime: Date;
  length?: ILength;
}

export interface IExerciseSegment {
  startTime: Date;
  endTime: Date;
  segmentType: number;
  repititions: number;
}

export interface IExerciseSessionRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  exerciseType: number;
  title?: string;
  notes?: string;
  segments: IExerciseSegment[];
  laps: IExerciseLap[];
  // implement exercise route
}

export interface IFloorsClimbedRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  floors: number;
}

export interface IPowerRecordSample {
  time: Date;
  // implement Power interface
  power: number;
}
export interface IPowerRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: IPowerRecordSample[];
}

export interface ISpeedRecordSample {
  time: Date;
  // implement speed valocity interface
  speed: number;
}

export interface ISpeedRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: ISpeedRecordSample[];
}

export interface IStepsCadenceRecordSample {
  time: Date;
  rate: number;
}

export interface IStepsCadenceRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: IStepsCadenceRecordSample[];
}

export interface IStepsRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  steps: number;
}

export interface ITotalCaloriesBurnedRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  energy: IEnergy;
}
