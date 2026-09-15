import express from 'express';
import { libraries } from '../data/libraries.js';

const router = express.Router();

router.get('', (req, res) => {
    const municipality = String(req.query.municipality || '').trim().toLowerCase();
    const service = String(req.query.service || '').trim().toLowerCase();
    const result = libraries.filter((library) => {
        const municipalityMatches = !municipality || library.municipality.toLowerCase().includes(municipality);
        const serviceMatches = !service || library.services.some((item) => item.toLowerCase() === service);
        return municipalityMatches && serviceMatches;
    });
    res.status(200).json(result);
});

export default router;
