export const DeviceType = {
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

export const healthDataTypes = [
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

export const DataCategories = [
  'Activity',
  'Body Measurement',
  'Cycle Tracking',
  'Nutrution',
  'Sleep',
  'Vitals',
];

export const RecordingMethod = {
  0: 'unknown',
  1: 'activelyRecorded',
  2: 'automaticallyRecorded',
  3: 'manualEntry',
};

export const ExerciseType = {
  1: 'ARM_CURL',
  2: 'BACK_EXTENSION',
  3: 'BALL_SLAM',
  4: 'BARBELL_SHOULDER_PRESS',
  5: 'BENCH_PRESS',
};

// HeartRate Represents the user's heart rate. Each record represents a series of measurements
interface HeartRateRecordSample {
  beatsPerMinute: number;
  instant: Date;
}
