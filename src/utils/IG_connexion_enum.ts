/* eslint-disable */

export enum ACCOUNT_IG {
    CFD = 'CFD',
    BR = 'Barrières et Options',
    TURBO = 'Turbo24'
}

export type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void;
export type PromiseReject = (error?: any) => void;
