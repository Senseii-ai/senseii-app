import { Schema, model } from "mongoose";
import { IBasalBodyTemperatureRecord, IBasalMetabolicRateRecord, IBodyMeasurement, IBoneMassRecord, IHeightRecord, ILeanBodyMassRecord } from "@senseii/types";

interface IBodyMeasurementDocument extends IBodyMeasurement, Document { }
interface IBasalBodyTemperatureDocument extends IBasalBodyTemperatureRecord, Document { }
interface IBasalMetabolicRateDocument extends IBasalMetabolicRateRecord, Document { }
interface IBoneMassDocument extends IBoneMassRecord, Document { }
interface IHeightDocument extends IHeightRecord, Document { }
interface ILeanBodyMassDocument extends ILeanBodyMassRecord, Document { }

const IBasalBodyTemperatureSchema: Schema<IBasalBodyTemperatureDocument> = new Schema({
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  temperature: { type: Number, required: true },
  measurementLocation: { type: Number, required: true },
})

const IBasalMetabolicRateSchema: Schema<IBasalMetabolicRateDocument> = new Schema({
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  basalMetabolicRate: { type: Number, required: true },
})

const IBoneMassSchema: Schema<IBoneMassDocument> = new Schema({
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  mass: { type: Number, required: true },
})

const IHeightSchema: Schema<IHeightDocument> = new Schema({
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  height: { type: Number, required: true },
})

const ILeanBodymassSchema: Schema<ILeanBodyMassDocument> = new Schema({
  time: { type: Date, required: true },
  zoneOffset: { type: Number },
  mass: { type: Number, required: true },

})

// TODO: Figure out if you want to keep the schema loose?
const UserBodyMeasurementSchema: Schema<IBodyMeasurementDocument> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  bodyMeasurement: {
    basalBodyTemperature: { type: IBasalBodyTemperatureSchema },
    boneMass: { type: IBoneMassSchema },
    height: { type: IHeightSchema },
    leanBodyMass: { type: ILeanBodymassSchema },
  }

})

const UserBodyMeasurementModel = model<IBodyMeasurementDocument>(
  "BodyMeasurement",
  UserBodyMeasurementSchema
)

export default UserBodyMeasurementModel
