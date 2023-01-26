import express from 'express';

import { currentUser } from '@rabztix/common';

const router = express();

//the middelwares currentUser are inserted in the route definition
router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send( { currentUser: req.currentUser || null }); //return a json
});

export { router as currentUserRouter };