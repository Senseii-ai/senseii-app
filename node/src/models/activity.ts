import { IActivity } from "../types/activity";
import { Schema } from "mongoose";

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
