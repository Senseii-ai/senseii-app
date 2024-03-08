import { IRecord } from './health';
import { Schema } from 'mongoose';

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

export interface IActiveCaloriesBurnedRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  energy: IEnergy;
}

export interface ICyclingPedalingCadenceRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  samples: ICyclingPedalingCadenceRecordSample[];
}

export interface IDistanceRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
  distance: ILength;
}

export interface IELevationGainedRecord extends IRecord {
  startTime: Date;
  startZoneOffset?: number;
  endTime: Date;
  endZoneOffset?: number;
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

export interface IActivity {
  user: Schema.Types.ObjectId;
  activity: {
    activeCaloriesBurned: IActiveCaloriesBurnedRecord[];
    cyclingPedalingCadence: ICyclingPedalingCadenceRecord[];
    distance: IDistanceRecord[];
    elevationGained: IELevationGainedRecord[];
    exerciseSession: IExerciseSessionRecord[];
    floorsClimbed: IFloorsClimbedRecord[];
    power: IPowerRecord[];
    speed: ISpeedRecord[];
    stepsCadence: IStepsCadenceRecord[];
    stepsRecord: IStepsRecord[];
    totalCaloriesBurned: ITotalCaloriesBurnedRecord[];
  };
}

export const UserActivitySchema = new Schema<IActivity>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  activity: {
    activeCaloriesBurned: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        energy: {
          calories: { type: Number, required: true },
          kiloCalories: { type: Number },
          joules: { type: Number },
          kiloJoules: { type: Number },
        },
        metaData: {
          clientId: { type: String, required: true },
          dataOrigin: { type: String, required: true },
          lastModifiedTime: { type: Date, required: true },
          clientRecordId: { type: String },
          clientRecordVersion: { type: Number, required: true },
          device: {
            manufacturer: { type: String },
            model: { type: String },
            type: { type: Number, required: true },
          },
          recordingMethod: { type: Number, required: true },
        },
      },
    ],
    cyclingPedalingCadence: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        samples: [
          {
            time: {
              type: Date,
              required: true,
            },
            revolutionPerMinute: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    distance: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        distance: {
          feet: { type: Number },
          inches: { type: Number },
          kilometer: { type: Number, required: true },
          meters: { type: Number, required: true },
          miles: { type: Number },
        },
      },
    ],
    elevationGained: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        elevation: {
          feet: { type: Number },
          inches: { type: Number },
          kilometer: { type: Number, required: true },
          meters: { type: Number },
          miles: { type: Number },
        },
      },
    ],
    exerciseSession: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        exerciseType: { type: Number, required: true },
        title: { type: String },
        notes: { type: String },
        segments: [
          {
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            segmentType: { type: Number, required: true },
            repititions: { type: Number, required: true },
          },
        ],
        laps: [
          {
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true },
            length: {
              feet: { type: Number },
              inches: { type: Number },
              kilometer: { type: Number, required: true },
              meters: { type: Number, required: true },
              miles: { type: Number },
            },
          },
        ],
      },
    ],
    floorsClimbed: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        floors: { type: Number, required: true },
      },
    ],
    power: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        samples: {
          time: { type: Date, required: true },
          power: { type: Number, required: true },
        },
      },
    ],
    speed: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        samples: {
          time: { type: Date, required: true },
          speed: { type: Number, required: true },
        },
      },
    ],
    stepsCadence: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        samples: {
          time: { type: Date, required: true },
          rate: { type: Number, required: true },
        },
      },
    ],
    stepsRecord: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        steps: { type: Number, required: true },
      },
    ],
    totalCaloriesBurned: [
      {
        startTime: { type: Date, required: true },
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        energy: {
          calories: { type: Number, required: true },
          kiloCalories: { type: Number },
          joules: { type: Number },
          kiloJoules: { type: Number },
        },
      },
    ],
  },
});
