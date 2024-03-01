import mongoose, { Schema, Types } from 'mongoose';

interface Meta {
  startTime: Date;
  endTime: Date;
  startTimeZoneOffset?: number;
  endZoneOffset?: number;
}

interface ActiveCaloriesBurned {
  meta: Meta;
  energy: Energy;
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
}
