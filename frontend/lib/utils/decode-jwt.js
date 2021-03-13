import jwt_decode from 'jwt-decode';

export const decodeJWT = (token) => jwt_decode(token)