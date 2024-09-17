// verifyGoogleToken.js
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv'


dotenv.config()

// Replace with your Google Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
    try {
        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });
        const payload = ticket.getPayload();

        // Return user information
        return {
            email: payload.email,
            name: payload.name,
            googleId: payload.sub, // User's unique Google ID
            picture: payload.picture,
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        throw new Error('Invalid Google token');
    }
};
