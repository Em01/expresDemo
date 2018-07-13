const Joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const router = express.router

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  }
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
})

const Customer = mongoose.model('Customer', customerSchema)

//getAll
router.get('/', async(req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers)
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  })

  customer = await customer.save();
  res.send(customer);
})


function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.number().min(5).max(50).isRequired()
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
