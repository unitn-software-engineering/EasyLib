export function isOperator(req) {
    return req.loggedUser?.role === 'operator';
}

export function requireOperator(req, res, next) {
    if (!req.loggedUser) return res.status(401).json({ success: false, message: 'Authentication required.' });
    if (!isOperator(req)) return res.status(403).json({ success: false, message: 'Operator role required.' });
    next();
}

export function canAccessStudent(req, studentId) {
    return isOperator(req) || !req.loggedUser?.id || String(req.loggedUser.id) === String(studentId);
}
