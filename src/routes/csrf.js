"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const csrf_1 = require("../middleware/csrf");
const router = (0, express_1.Router)();
router.get('/token', (req, res, next) => {
    try {
        const sessionId = req.session?.id;
        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session required for CSRF token',
            });
        }
        const token = (0, csrf_1.generateCSRFToken)(sessionId);
        res.json({
            success: true,
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=csrf.js.map