import express from 'express';

const router = express();

router.post('/api/users/signout', (req, res) => {
    req.session = null;  //check the SESSION library documentation

    res.send({});
});

export { router as signoutRouter };