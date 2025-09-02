import { Request, Response, NextFunction } from 'express';
interface CSRFRequest extends Request {
    csrfToken?: string;
}
export declare function generateCSRFToken(sessionId: string): string;
export declare function validateCSRFToken(sessionId: string, token: string): boolean;
export declare function cleanupExpiredTokens(): void;
export declare const csrfProtection: (req: CSRFRequest, res: Response, next: NextFunction) => void;
export declare const addCSRFToken: (req: CSRFRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=csrf.d.ts.map