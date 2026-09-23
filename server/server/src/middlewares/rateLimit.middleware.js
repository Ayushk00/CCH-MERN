import rateLimit from "express-rate-limit";

const json = (message) => ({ statusCode: 429, success: false, message, data: null, errors: [] });

// Brute-force protection: only failed logins count toward the limit
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: json("Too many failed login attempts. Please try again in 15 minutes."),
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: json("Too many accounts created from this network. Please try again later."),
});

const sensitiveActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: json("Too many requests. Please try again later."),
});

export { loginLimiter, registerLimiter, sensitiveActionLimiter };
