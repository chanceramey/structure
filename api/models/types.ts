import * as Express  from 'express';

export interface APIRequest extends Express.Request {
    userID: number;
}

export interface APIResponse extends Express.Response { }

export interface APIMiddware extends Express.NextFunction {}

export interface BasicRecord {
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface User extends BasicRecord {
    id: number;
    email: string;
    hash: string;
    first_name: string;
    last_name: string;
    admin: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Board extends BasicRecord {
    user_id: number;
    structure: string;
}