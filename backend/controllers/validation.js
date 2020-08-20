const Joi = require('@hapi/joi')


exports.signUpValidation  = (data) =>{
    const schema = Joi.object({
        first_name: Joi.string().min(4).required(),
    
          last_name: Joi.string().min(4).required(),
          
          email:Joi.string().min(6).required().email(),
          password: Joi.string().min(6).required(),
    });
    return Joi.validate(data, schema)
}

exports.loginValidation  = (data) =>{
    const schema = Joi.object({
          email:Joi.string().min(6).required().email(),
          password: Joi.string().min(6).required(),
    });
    return Joi.validate(data, schema)
}


