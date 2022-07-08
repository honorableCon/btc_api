const router = require('express').Router();
const createToken = require('../service/createToken');
const findUser = require('../service/findUser');
const loginValidator = require('../validations/loginValidation');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginValidator({ email, password });
    
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const user = await findUser({email, password})

    if(user){
        const { email, role, status } = user;
        const payload = { email, role, status };
        const token = await createToken(payload);
        res.header('auth-token', token);
        res.header('Authorization', `Bearer ${token}`);
        return res.status(200).send(payload);
    }

    return res.status(400).send('Invalid email or password');
})

module.exports = router;