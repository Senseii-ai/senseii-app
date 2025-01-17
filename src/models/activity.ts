import { IActiveCaloriesBurnedRecord, IActivity, ICyclingPedalingCadenceRecord, IDistanceRecord, IELevationGainedRecord, IExerciseSessionRecord, IFloorsClimbedRecord, IPowerRecord, ISpeedRecord, IStepsCadenceRecord, IStepsRecord, ITotalCaloriesBurnedRecord } from "@senseii/types";
import { Schema, model } from "mongoose";

interface IUserActivityDocument extends IActivity, Document { }
interface IActiveCaloriesBurnedDocument extends IActiveCaloriesBurnedRecord, Document { }
interface ICyclingPedalingCadenceDocument extends ICyclingPedalingCadenceRecord, Document { }
interface IDistanceDocument extends IDistanceRecord, Document { }
interface IElevationGainedDocument extends IELevationGainedRecord, Document { }
interface IExerciseSessionDocument extends IExerciseSessionRecord, Document { }
interface IFloorsClimbedDocument extends IFloorsClimbedRecord, Document { }
interface IPowerDocument extends IPowerRecord, Document { }
interface ISpeedDocument extends ISpeedRecord, Document { }
interface IStepsCadenceDocument extends IStepsCadenceRecord, Document { }
interface IStepsRecordDocumet extends IStepsRecord, Document { }
interface ITotalCaloreisBurnedDocument extends ITotalCaloriesBurnedRecord, Document { }


const IActiveCaloriesBurnedSchema: Schema<IActiveCaloriesBurnedDocument> = new Schema({
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
})

const ICyclingPedalingCadenceSchema: Schema<ICyclingPedalingCadenceDocument> = new Schema({
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
})

const IDistanceSchema: Schema<IDistanceDocument> = new Schema({
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
})

const IElevationGainedSchema: Schema<IElevationGainedDocument> = new Schema({
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

})

const IExerciseSessionSchema: Schema<IExerciseSessionDocument> = new Schema({
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

})

const IFloorsClimbedSchema: Schema<IFloorsClimbedDocument> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  floors: { type: Number, required: true },
})

const IPowerSchema: Schema<IPowerDocument> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  samples: {
    time: { type: Date, required: true },
    power: { type: Number, required: true },
  },

})

const ISpeedSchema: Schema<ISpeedDocument> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  samples: {
    time: { type: Date, required: true },
    speed: { type: Number, required: true },
  },

})

const IStepsCadenceSchema: Schema<IStepsCadenceDocument> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  samples: {
    time: { type: Date, required: true },
    rate: { type: Number, required: true },
  },

})

const IStepsSchema: Schema<IStepsRecordDocumet> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  steps: { type: Number, required: true },
})

const ITotalCaloriesBurnedSchema: Schema<ITotalCaloreisBurnedDocument> = new Schema({
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  energy: {
    calories: { type: Number, required: true },
    kiloCalories: { type: Number },
    joules: { type: Number },
    kiloJoules: { type: Number },
  }
})

export const IUserActivitySchema: Schema<IUserActivityDocument> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  activity: {
    activeCaloriesBurned: { type: [IActiveCaloriesBurnedSchema] },
    cyclingPedalingCadence: { type: [ICyclingPedalingCadenceSchema] },
    distance: { type: [IDistanceSchema] },
    elevationGained: { type: [IElevationGainedSchema] },
    exerciseSession: { type: [IExerciseSessionSchema] },
    floorsClimbed: { type: [IFloorsClimbedSchema] },
    power: { type: [IPowerSchema] },
    speed: { type: [ISpeedSchema] },
    stepsCadence: { type: [IStepsCadenceSchema] },
    stepsRecord: { type: [IStepsSchema] },
    totalCaloriesBurned: { type: [ITotalCaloriesBurnedSchema] }
  }
})

const UserActivityModel = model<IUserActivityDocument>(
  "UserACtivity",
  IUserActivitySchema
)

export default UserActivityModel
