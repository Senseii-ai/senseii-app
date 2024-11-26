// constants/http.ts

export const HTTP = {
  METHOD: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
    OPTIONS: 'OPTIONS',
    TRACE: 'TRACE',
    CONNECT: 'CONNECT',
  } as const,

  STATUS: {
    // 2xx Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,

    // 3xx Redirection
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,

    // 4xx Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
  } as const,

  HEADER: {
    // Authentication
    AUTHORIZATION: 'Authorization',
    WWW_AUTHENTICATE: 'WWW-Authenticate',
    PROXY_AUTHENTICATE: 'Proxy-Authenticate',
    PROXY_AUTHORIZATION: 'Proxy-Authorization',

    // Caching
    CACHE_CONTROL: 'Cache-Control',
    CLEAR_SITE_DATA: 'Clear-Site-Data',
    EXPIRES: 'Expires',
    PRAGMA: 'Pragma',
    WARNING: 'Warning',

    // Client hints
    ACCEPT: 'Accept',
    ACCEPT_CHARSET: 'Accept-Charset',
    ACCEPT_ENCODING: 'Accept-Encoding',
    ACCEPT_LANGUAGE: 'Accept-Language',

    // Conditionals
    LAST_MODIFIED: 'Last-Modified',
    ETAG: 'ETag',
    IF_MATCH: 'If-Match',
    IF_NONE_MATCH: 'If-None-Match',
    IF_MODIFIED_SINCE: 'If-Modified-Since',
    IF_UNMODIFIED_SINCE: 'If-Unmodified-Since',

    // Connection management
    CONNECTION: 'Connection',
    KEEP_ALIVE: 'Keep-Alive',

    // Content negotiation
    CONTENT_TYPE: 'Content-Type',
    CONTENT_LENGTH: 'Content-Length',
    CONTENT_LANGUAGE: 'Content-Language',
    CONTENT_ENCODING: 'Content-Encoding',
    CONTENT_LOCATION: 'Content-Location',

    // Controls
    EXPECT: 'Expect',
    MAX_FORWARDS: 'Max-Forwards',

    // Cookies
    COOKIE: 'Cookie',
    SET_COOKIE: 'Set-Cookie',

    // CORS
    ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
    ACCESS_CONTROL_ALLOW_CREDENTIALS: 'Access-Control-Allow-Credentials',
    ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers',
    ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
    ACCESS_CONTROL_EXPOSE_HEADERS: 'Access-Control-Expose-Headers',
    ACCESS_CONTROL_MAX_AGE: 'Access-Control-Max-Age',
    ACCESS_CONTROL_REQUEST_HEADERS: 'Access-Control-Request-Headers',
    ACCESS_CONTROL_REQUEST_METHOD: 'Access-Control-Request-Method',
    ORIGIN: 'Origin',
    TIMING_ALLOW_ORIGIN: 'Timing-Allow-Origin',

    // Security
    STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',
    X_CONTENT_TYPE_OPTIONS: 'X-Content-Type-Options',
    X_FRAME_OPTIONS: 'X-Frame-Options',
    X_XSS_PROTECTION: 'X-XSS-Protection',
  } as const,

  CONTENT_TYPE: {
    // Application
    JSON: 'application/json',
    XML: 'application/xml',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    FORM_DATA: 'multipart/form-data',
    OCTET_STREAM: 'application/octet-stream',
    PDF: 'application/pdf',
    ZIP: 'application/zip',

    // Text
    HTML: 'text/html',
    PLAIN: 'text/plain',
    CSS: 'text/css',
    CSV: 'text/csv',

    // Image
    PNG: 'image/png',
    JPEG: 'image/jpeg',
    GIF: 'image/gif',
    SVG: 'image/svg+xml',

    // Audio
    MP3: 'audio/mpeg',
    WAV: 'audio/wav',

    // Video
    MP4: 'video/mp4',
    MPEG: 'video/mpeg',
  } as const,

  CACHE_CONTROL: {
    NO_CACHE: 'no-cache',
    NO_STORE: 'no-store',
    NO_TRANSFORM: 'no-transform',
    ONLY_IF_CACHED: 'only-if-cached',
    PRIVATE: 'private',
    PUBLIC: 'public',
    MUST_REVALIDATE: 'must-revalidate',
    PROXY_REVALIDATE: 'proxy-revalidate',
  } as const,

  // Common status code messages
  STATUS_MESSAGE: {
    [200]: 'OK',
    [201]: 'Created',
    [204]: 'No Content',
    [400]: 'Bad Request',
    [401]: 'Unauthorized',
    [403]: 'Forbidden',
    [404]: 'Not Found',
    [409]: 'Conflict',
    [422]: 'Unprocessable Entity',
    [429]: 'Too Many Requests',
    [500]: 'Internal Server Error',
    [502]: 'Bad Gateway',
    [503]: 'Service Unavailable',
  } as const,
} as const;

// Type utilities
export type HTTPMethod = typeof HTTP.METHOD[keyof typeof HTTP.METHOD];
export type HTTPStatus = typeof HTTP.STATUS[keyof typeof HTTP.STATUS];
export type HTTPHeader = typeof HTTP.HEADER[keyof typeof HTTP.HEADER];
export type HTTPContentType = typeof HTTP.CONTENT_TYPE[keyof typeof HTTP.CONTENT_TYPE];

// Example usage:
export type APIEndpoint = {
  method: HTTPMethod;
  path: string;
  status: HTTPStatus;
  contentType: HTTPContentType;
};

// Helper functions
export const isSuccessStatus = (status: number): boolean =>
  status >= HTTP.STATUS.OK && status < HTTP.STATUS.MULTIPLE_CHOICES;

export const isClientError = (status: number): boolean =>
  status >= HTTP.STATUS.BAD_REQUEST && status < HTTP.STATUS.INTERNAL_SERVER_ERROR;

export const isServerError = (status: number): boolean =>
  status >= HTTP.STATUS.INTERNAL_SERVER_ERROR && status < 600;

// Usage example:
/*
import { HTTP } from './constants/http';

const response = {
  status: HTTP.STATUS.OK,
  headers: {
    [HTTP.HEADER.CONTENT_TYPE]: HTTP.CONTENT_TYPE.JSON,
    [HTTP.HEADER.CACHE_CONTROL]: HTTP.CACHE_CONTROL.NO_CACHE
  },
  body: JSON.stringify({ message: 'Success' })
};

if (isSuccessStatus(response.status)) {
  // Handle success
}
*/
