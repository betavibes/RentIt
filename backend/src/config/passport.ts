import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                const googleId = profile.id;
                const name = profile.displayName;

                if (!email) {
                    return done(new Error('No email found in Google profile'), undefined);
                }

                // Check if user exists
                const userCheck = await pool.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [googleId, email]);
                let user = userCheck.rows[0];

                if (user) {
                    // If user exists but no google_id, link it
                    if (!user.google_id) {
                        const updateResult = await pool.query(
                            'UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *',
                            [googleId, user.id]
                        );
                        user = updateResult.rows[0];
                    }
                    return done(null, user);
                }

                // Create new user
                const newUser = await pool.query(
                    'INSERT INTO users (id, email, google_id, name, role, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [uuidv4(), email, googleId, name, 'customer', true]
                );
                user = newUser.rows[0];
                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

export default passport;
