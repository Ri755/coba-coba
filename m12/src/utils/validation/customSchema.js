const Joi = require("joi");

const customPengecekan = (value, helpers) => {
  if (value === "-") {
    return helpers.error("any.invalid");
  }

  if (Number(value.length) !== 9) {
    throw new Error("Panjang nomor nota tak benar");
  }

  if (value.substr(0, 3) !== "INV") {
    throw new Error("Kode invoice harus diawali dengan INV");
  }
};

const schema = Joi.object({
  kodeInvoice: Joi.string().custom(customPengecekan, "Pengecekan kode invoice"),
  nama:Joi.string().alphanum().min(10),
  nama1:Joi.string().required(),
  nama2:Joi.string().required(),
});

module.exports = schema;
