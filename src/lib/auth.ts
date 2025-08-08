import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '@/env';

const SECRET = env.JWT_SECRET;

interface userPayload extends JwtPayload {
    id?: string
    role?: string;
}

export function generateToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET) as userPayload;
    } catch {
        return null;
    }
}
