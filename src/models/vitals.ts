import { IBloodGlucoseRecord, IBloodPressureRecord, IBodyFatRecord, IBodyTemperatureRecord, IHeartRateRecord, IHeartRateVariabilityRmssdRecord, IHydrationRecord, IOxygenSaturationRecord, IRespiratoryRateRecord, IRestingHeartRateRecord, IVitals, IVo2MaxRecord, IWaterMassRecord } from "@senseii/types";
import { Schema, model } from "mongoose";

interface IBloodGlucoseDocument extends IBloodGlucoseRecord, Document { }
interface IUserVitalsDocument extends IVitals, Document { }
interface IBloodPressureDocument extends IBloodPressureRecord, Document { }
interface IBodyFatDocument extends IBodyFatRecord, Document { }
interface IBodyTemperatureDocument extends IBodyTemperatureRecord, Document { }
interface IBodyWaterMassDocument extends IWaterMassRecord, Document { }
interface IHeartRateDocument extends IHeartRateRecord, Document { }
interface IHeartRateVariabilityRmssdDocument extends IHeartRateVariabilityRmssdRecord, Document { }
interface IHydrationDocument extends IHydrationRecord, Document { }
interface IOxygenSaturationDocument extends IOxygenSaturationRecord, Document { }
interface IRespiratoryRateDocument extends IRespiratoryRateRecord, Document { }
interface IRestingHeartRateDocument extends IRestingHeartRateRecord, Document { }
interface IVo2MaxDocument extends IVo2MaxRecord, Document { }

const BloodGlucoseSchema: Schema<IBloodGlucoseDocument> = new Schema({
  recordType: { type: String, required: true, default: 'BloodGlucose' },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  level: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['milligramsPerDeciliter', 'millimolesPerLiter'],
      required: true,
    },
  },
  mealType: { type: Number, required: true },
  specimenSource: { type: Number, required: true },
  relationToMeal: { type: Number, required: true },
})

const BloodPressureSchema: Schema<IBloodPressureDocument> = new Schema({
  recordType: { type: String, required: true, default: 'BloodPressure' },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  systolic: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['millimetersOfMercury'],
      required: true,
    },
  },
  diastolic: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['millimetersOfMercury'],
      required: true,
    },
  },
  bodyPosition: { type: Number, required: true },
  measurementLocation: { type: Number, required: true },
})

const BodyFatSchema: Schema<IBodyFatDocument> = new Schema({
  recordType: { type: String, required: true, default: 'BodyFat' },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  percentage: { type: Number, required: true },
})

const BodyTemperatureSchema: Schema<IBodyTemperatureDocument> = new Schema({
  recordType: {
    type: String,
    required: true,
    default: 'BodyTemperature',
  },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  temperature: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      required: true,
    },
  },
  measurementLocation: { type: Number },
})

const WaterMassSchema: Schema<IBodyWaterMassDocument> = new Schema({
  recordType: { type: String, required: true, default: 'WaterMass' },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  mass: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: [
        'grams',
        'kilograms',
        'milligrams',
        'micrograms',
        'ounces',
        'pounds',
      ],
      required: true,
    },
  },
})

const HeartRateSchema: Schema<IHeartRateDocument> = new Schema({
  recordType: { type: String, required: true, default: 'HeartRate' },
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  samples: [
    {
      time: { type: Date, required: true },
      beatsPerMinute: { type: Number, required: true },
    },
  ],
})

const HeartRateVariabilityRmssdSchema: Schema<IHeartRateVariabilityRmssdDocument> = new Schema({
  recordType: {
    type: String,
    required: true,
    default: 'HeartRateVariabilityRmssd',
  },
  time: { type: Date, required: true },
  zoneOffSet: { type: Number },
  heartRateVariabilityMillis: { type: Number, required: true },
})

const HydrationSchema: Schema<IHydrationDocument> = new Schema({
  recordType: { type: String, required: true, default: 'Hydration' },
  startTime: { type: Date, required: true },
  startZoneOffset: { type: Number },
  endTime: { type: Date, required: true },
  endZoneOffset: { type: Number },
  volume: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['liters', 'fluidOuncesUs', 'milliliters'],
      required: true,
    },
  },
})

const OxygenSaturationSchema: Schema<IOxygenSaturationDocument> = new Schema({
  recordType: {
    type: String,
    required: true,
    default: 'OxygenSaturation',
  },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  percentage: { type: Number, required: true },
})

const RespiratoryRateSchema: Schema<IRespiratoryRateDocument> = new Schema({
  recordType: {
    type: String,
    required: true,
    default: 'RespiratoryRate',
  },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  rate: { type: Number, required: true },
})

const RestingHeartRateSchema: Schema<IRestingHeartRateDocument> = new Schema({
  recordType: {
    type: String,
    required: true,
    default: 'RestingHeartRate',
  },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  beatsPerMinute: { type: Number, required: true },
})

const Vo2MaxSchema: Schema<IVo2MaxDocument> = new Schema({
  recordType: { type: String, required: true, default: 'Vo2Max' },
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  vo2MillilitersPerMinuteKilogram: { type: Number, required: true },
  measurementMethod: { type: Number, required: true },
})

// TODO: Check what is a compulsory field in this Document, right now they are all not required.
const UserVitalsSchema: Schema<IUserVitalsDocument> = new Schema({
  user: { type: Schema.Types.ObjectId },
  vitals: {
    bloodGlucose: { type: [BloodGlucoseSchema] },
    bloodPressure: { type: [BloodPressureSchema] },
    bodyFat: { type: [BodyFatSchema] },
    bodyTemperature: { type: [BodyTemperatureSchema] },
    waterMass: { type: [WaterMassSchema] },
    heartRate: { type: [HeartRateSchema] },
    heartRateVariability: { type: [HeartRateVariabilityRmssdSchema] },
    hydration: { type: [HydrationSchema] },
    oxygenSaturation: { type: [OxygenSaturationSchema] },
    respiratoryRate: { type: [RespiratoryRateSchema] },
    restingHeartRate: { type: [RestingHeartRateSchema] },
    vo2Max: { type: Vo2MaxSchema },
  },
}
)

// TODO: Test out what is the difference between declaring model like this and the one in Nutrition Plan
export const UserVitalsModel = model<IUserVitalsDocument>(
  "UserVitals",
  UserVitalsSchema,
)
