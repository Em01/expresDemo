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

//Creates a new customer
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

//updates based on ID
router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});


//Deletes the customer
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

//Finds Customer by ID
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});


function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.number().min(5).max(50).isRequired()
  };

  return Joi.validate(customer, schema);
}

module.exports = router;
