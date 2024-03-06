export const MEASUREMENT_METHOD_VO2_MAX = {
  0: 'OTHER',
  1: 'METABOLIC_CART',
  2: 'HEART_RATE_RATIO',
  3: 'COOPER_TEST',
  4: 'MULTI_STAGE_FITNESS_TEST',
  5: 'ROCKPORT_FITNESS_TEST',
};

export const BODY_POSITION = {
  0: 'UNKNOWN',
  1: 'STANDING_UP',
  2: 'SITTING_DOWN',
  3: 'LYING_DOWN',
  4: 'RECLINIING',
};

export const MEASUREMENTLOCATION = {
  0: 'UNKNOWN',
  1: 'LEFT_WRIST',
  2: 'RIGHT_WRIST',
  3: 'LEFT_UPPER_ARM',
  4: 'RIGHT_UPPER_ARM',
};

export const RELATION_TO_MEAL = {
  0: 'UNKNOWN',
  1: 'GENERAL',
  2: 'FASTING',
  3: 'BEFORE_MEAL',
  4: 'AFTER_MEAL',
};

export const SPECIMEN_SOURCE = {
  0: 'UNKNOWN',
  1: 'INTERSTITIAL_FLUID',
  2: 'CAPILLARY_BLLOD',
  3: 'PLASMA',
  4: 'SERUM',
  5: 'TEARS',
  6: 'WHOLE_BLOOD',
};
export const MEAL_TYPE = {
  0: 'UNKNOWN',
  1: 'BREAKFAST',
  2: 'LUNCH',
  3: 'DINNER',
  4: 'SNACK',
};

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
