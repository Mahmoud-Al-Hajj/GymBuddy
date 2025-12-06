import Joi from "joi";

export default (schema) => (req, res, next) => {
  const result = Joi.object(schema).validate(req.body);

  if (result.error)
    return res.status(400).send({ error: result.error.details[0].message });

  next();
};
