export const DeviceType = {
  0: "unknown",
  1: "watch",
  2: "phone",
  3: "scale",
  4: "ring",
  5: "headMounted",
  6: "fitnessBand",
  7: "chestStrap",
  8: "smartDisplay",
};

export const healthDataTypes = [
  "basalMetabolicRate",
  "bloodGlucose",
  "Blood Pressure",
  "Body Fat",
  "Body Temperature",
  "Distance",
  "Exercise",
  "Heart Rate",
  "Height",
  "Hydration",
  "Nutrition",
  "Oxygen saturation",
  "power",
  "Respiratory Rate",
  "Sleep",
  "Speed",
  "Steps",
  "Total Clories Burned",
  "Weight",
];

export const DataCategories = [
  "Activity",
  "Body Measurement",
  "Cycle Tracking",
  "Nutrution",
  "Sleep",
  "Vitals",
];

export const RecordingMethod = {
  0: "unknown",
  1: "activelyRecorded",
  2: "automaticallyRecorded",
  3: "manualEntry",
};

export const ExerciseSegment = {
  0: "UNKNOWN",
  1: "ARM_CURL",
  2: "BACK_EXTENSION",
  3: "BALL_SLAM",
  4: "BARBELL_SHOULDER_PRESS",
  5: "BENCH_PRESS",
  6: "BENCH_SIT_UP",
  7: "BIKING",
  8: "BIKING_STATIONARY",
  9: "BURPEE",
  10: "CRUNCH",
  11: "DEADLIFT",
  12: "ARM_TRICEP_EXTENSION",
  13: "DUMBBELL_CURL_LEFT_ARM",
  14: "DUMBBELL_CURL_RIGHT_ARM",
  15: "DUMBBELL_FRONT_RAISE",
  16: "DUMBBELL_LATERAL_RAISE",
  17: "DUMBBELL_ROW",
  18: "DUMBBELL_TRICEP_EXTENSION_LEFT_ARM",
  19: "DUMBBELL_TRICEP_EXTENSION_RIGHT_ARM",
  20: "DUMBBELL_TRICEP_EXTENSION_TWO_ARM",
  21: "ELLIPTICAL",
  22: "FORWARD_TWIST",
  23: "FRONT_RAISE",
  24: "HIGH_INTENSITY_INTERVAL_TRAINING",
  25: "HIP_THRUST",
  26: "HULA_HOOP",
  27: "JUMPING_JACK",
  28: "JUMP_ROPE",
  29: "KETTLEBALL_SWING",
  30: "LATERAL_RAISES",
  31: "LAT_PULL_DOWN",
  32: "LEG_CURL",
  33: "LEG_EXTENSION",
  34: "LEG_PRESS",
  35: "LEG_RAISE",
  36: "LUNGE",
  37: "MOUNTAIN_CLIMBER",
  38: "OTHER_WORKOUT",
  39: "PAUSE",
  40: "PILATES",
  41: "PLANK",
  42: "PULL_UP",
  43: "PUNCH",
  44: "REST",
  45: "ROWING_MACHINE",
  46: "RUNNING",
  47: "RUNNING_TREADMILL",
  48: "SHOULDER_PRESS",
  49: "SINGLE_ARM_TRICEP_EXTENSION",
  50: "SIT_UP",
  51: "SQUAT",
  52: "STAIR_CLIMBING",
  53: "STAIR_CLIMBING_MACHINE",
  54: "STRETCHING",
  55: "SWIMMING_BACKSTROKE",
  56: "SWIMMING_BREASTSTROKE",
  57: "SWIMMING_BUTTERFLY",
  58: "SWIMMING_FREESTYLE",
  59: "SWIMMING_MIXED",
  60: "SWIMMING_OPEN_WATER",
  61: "SWIMMING_OTHER",
  62: "SWIMMING_POOL",
  63: "UPPER_TWIST",
  64: "WALKING",
  65: "WEIGHT_LIFTING",
  66: "WHEELCHAIR",
  67: "YOGA",
};

// HeartRate Represents the user's heart rate. Each record represents a series of measurements
interface HeartRateRecordSample {
  beatsPerMinute: number;
  instant: Date;
}
