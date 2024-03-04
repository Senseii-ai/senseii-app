import mongoose, { Schema, Types, Document } from 'mongoose';

interface Device {
  manufacturer?: string;
  model?: string;
  type: number;
}

const DeviceType = {
  0: 'unknown',
  1: 'watch',
  2: 'phone',
  3: 'scale',
  4: 'ring',
  5: 'headMounted',
  6: 'fitnessBand',
  7: 'chestStrap',
  8: 'smartDisplay',
};

const healthDataTypes = [
  'basalMetabolicRate',
  'bloodGlucose',
  'Blood Pressure',
  'Body Fat',
  'Body Temperature',
  'Distance',
  'Exercise',
  'Heart Rate',
  'Height',
  'Hydration',
  'Nutrition',
  'Oxygen saturation',
  'power',
  'Respiratory Rate',
  'Sleep',
  'Speed',
  'Steps',
  'Total Clories Burned',
  'Weight',
];

const DataCategories = [
  'Body Measurement',
  'Cycle Tracking',
  'Nutrution',
  'Sleep',
  'Vitals',
];

interface MetaData {
  clientId: string;
  dataOrigin: string;
  lastModifiedTime: Date;
  clientRecordId?: string;
  clientRecordVersion: number;
  device?: Device;
  recordingMethod: number;
}

interface Record {
  metaDate: MetaData;
}

interface BodyMeasurementRecord extends Record {
  timeData: Meta;
  energy: Energy;
}

const testData: BodyMeasurementRecord = {
  metaDate: {
    clientId: '1234',
    dataOrigin: String(Date.now()),
    lastModifiedTime: new Date(),
    clientRecordId: '12345',
    clientRecordVersion: 4,
    device: {
      type: 2,
    },
    recordingMethod: 4,
  },
  timeData: {
    startTime: new Date(),
    endTime: new Date(),
  },
  energy: {
    kiloCalories: 20,
    kiloJoules: 20,
    joules: 20,
  },
};

interface ActiveCaloriesBurned {
  meta: Meta;
  energy: Energy;
  metadata: MetaData;
}
interface Energy {
  calories?: number;
  kiloCalories: number;
  joules: number;
  kiloJoules: number;
}
const HealthRecordSchema = new Schema({
  activeCaloriesBurned: {
    startTime: {
      type: Date,
      required: true,
    },
    startZoneOffset: String,
    endTime: {
      type: Date,
      required: true,
    },
    endZoneOffset: String,
    energy: {
      required: true,
      unit: {
        required: true,
        enum: ['Calories', 'Kilocalories', 'Joules', 'KiloJoules'],
      },
      value: {
        type: Number,
        required: true,
      },
    },
  },
});

const RecordingMethod = {
  0: 'unknown',
  1: 'activelyRecorded',
  2: 'automaticallyRecorded',
  3: 'manualEntry',
};

interface Meta {
  startTime: Date;
  endTime: Date;
  startTimeZoneOffset?: number;
  endZoneOffset?: number;
}

interface ActiveCaloriesBurned {
  meta: Meta;
  energy: Energy;
  metadata: MetaData;
}

interface Energy {
  calories?: number;
  kiloCalories: number;
  joules: number;
  kiloJoules: number;
}

// Captures distance travelled by the user since the last reading. multiple Distance records can be added together to find the total count.
interface DistanceRecord {
  meta: Meta;
  distance: Length;
  metadata: MetaData;
}

interface Length {
  feet?: number;
  inches?: number;
  kilometres: number;
  meters: number;
  miles?: number;
}

// HeartRate Represents the user's heart rate. Each record represents a series of measurements
interface HeartRateRecordSample {
  beatsPerMinute: number;
  instant: Date;
}

interface HeartRateRecord {
  meta: Meta;
  samples: Array<HeartRateRecordSample>;
  metadata: MetaData;
}

interface HeightRecord {
  time: Date;
  zoneOffset: number;
  height: Length;
  metadata: MetaData;
}
