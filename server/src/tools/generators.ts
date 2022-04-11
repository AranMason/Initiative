import { randomBytes } from 'crypto';

export async function getRoomId() {
    var token = await randomBytes(4).toString('hex');

    return token;
}
