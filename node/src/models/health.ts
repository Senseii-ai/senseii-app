import { Schema } from 'mongoose';
import {
  IBloodGlucoseRecord,
  IBloodPressureRecord,
  IBodyFatRecord,
  IBodyTemperatureRecord,
  IHeartRateRecord,
  IHeartRateVariabilityRmssdRecord,
  IHydrationRecord,
  ILeanBodyMassRecord,
  IOxygenSaturationRecord,
  IRespiratoryRateRecord,
  IRestingHeartRateRecord,
  IVo2MaxRecord,
  IWaterMassRecord,
} from './vitals';

import {
  IActiveCaloriesBurnedRecord,
  ICyclingPedalingCadenceRecord,
  IDistanceRecord,
  IELevationGainedRecord,
  IExerciseSessionRecord,
  IFloorsClimbedRecord,
  IPowerRecord,
  ISpeedRecord,
  IStepsCadenceRecord,
  IStepsRecord,
  ITotalCaloriesBurnedRecord,
} from './activity';

import {
  IBasalBodyTemperatureRecord,
  IBasalMetabolicRateRecord,
  IBoneMassRecord,
  IHeightRecord,
} from './bodyMeasurement';

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

export interface HealthDataRecords {
  user: Schema.Types.ObjectId;
  vitals: {
    bloodGlucose: IBloodGlucoseRecord[];
    bloodPressure: IBloodPressureRecord[];
    bodyFat: IBodyFatRecord[];
    bodyTemperature: IBodyTemperatureRecord[];
    waterMass: IWaterMassRecord[];
    heartRate: IHeartRateRecord[];
    heartRateVariability: IHeartRateVariabilityRmssdRecord[];
    hydrationRecord: IHydrationRecord[];
    leanBodyMass: ILeanBodyMassRecord[];
    oxygenSaturation: IOxygenSaturationRecord[];
    respiratoryRate: IRespiratoryRateRecord[];
    restingHeartRate: IRestingHeartRateRecord[];
    vo2Max: IVo2MaxRecord[];
  };
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
  bodyMeasurement: {
    basalBodyTemperature: IBasalBodyTemperatureRecord[];
    basalMetabolicRate: IBasalMetabolicRateRecord[];
    boneMass: IBoneMassRecord[];
    height: IHeightRecord[];
    leanBodyMass: ILeanBodyMassRecord[];
  };
}

const healthDataRecordsSchema = new Schema<HealthDataRecords>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  vitals: {
    bloodGlucose: [
      {
        time: {type: Date, required: true,},
        zoneOffset: {type: Number},
        level: {type: Number, required: true,},
        mealType: {type: Number, required: true,},
        specimenSource: {type: Number, required: true},
        relationToMeal: {type: Number, require: true,},
      },
    ],
    bloodPressure: [
      {
        time: {type: Date, required: true},
        zoneOffset: {type: Number},
        systolic: {type: Number, required: true},
        diastolic: {type: Number,required: true},
        bodyPosition: {type: Number,required: true},
        measurementLocation: {type: Number,required: true},
      },
    ],
    waterMass: [
      {
        time: {type: Date, required: true,},
        zoneOffset: {type: Number},
        mass: {type: Number, require: true},
      },
    ],
    heartRate: [
      {
        startTime: {type: Date, required: true,},
        startZoneOffset: {type: Number,},
        endTime: {type: Date, required: true,},
        endZoneOffset: {type: Number,},
        samples: [
          {
            time: {type: Date, required: true,},
            beatsPerMinute: {type: Number,required: true,},
          },
        ],
      },
    ],
    heartRateVariability: [
      {
        time: {type: Date, required: true,},
        zoneOffset: {type: Number,},
        heartRateVariabilityMillis: {type: Number, required: true,},
      },
    ],
    hydrationRecord: [
      {
        startTime: {type: Date, required: true,},
        startZoneOffset: { type: Number },
        endTime: { type: Date, required: true },
        endZoneOffset: { type: Number },
        volume: { type: Number, required: true },
      },
    ],
    leanBodyMass: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        mass: { type: Number, required: true },
      },
    ],
    oxygenSaturation: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        percentage: { type: Number, required: true },
      },
    ],
    respiratoryRate: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        rate: { type: Number, required: true },
      },
    ],
    restingHeartRate: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        beatsPerMinute: { type: Number, required: true },
      },
    ],
    vo2Max: [
      {
        time: { type: Date, required: true },
        zoneOffset: { type: Number },
        vo2MillilitersPerMinuteKilogram: { type: Number, required: true },
        measurementMethod: { type: Number, required: true },
      }.
    ]
  },
});
