type StringAsNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
type CodeClasses = 1 | 2 | 3 | 4 | 5;
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type HttpCodes = StringAsNumber<`${CodeClasses}${Digit}${Digit}`>;
export type HttpCodeClass<Class extends number> = StringAsNumber<`${Class}${Digit}${Digit}`>;

export type ResponseCodes100 = 100 | 101 | 102 | 103 | 122;
export type ResponseCodes200 = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
export type ResponseCodes300 = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
export type ResponseCodes400 =
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 418
    | 421
    | 422
    | 423
    | 424
    | 425
    | 426
    | 428
    | 429
    | 431
    | 451;
export type ResponseCodes500 = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

export type ResponseOk = ResponseCodes100 | ResponseCodes200 | ResponseCodes300;
export type ResponseError = ResponseCodes400 | ResponseCodes500;
