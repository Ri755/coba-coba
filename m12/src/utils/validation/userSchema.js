// install joi: npm i joi @joi/date

const Joi = require("joi");

const penggunaSchema = Joi.object({
  pengguna_nama: Joi.string().min(3).max(50).required().label("Nama Pengguna").messages({
    "any.required": "{{#label}} harus diisi",
    "string.min": "{{#label}} minimal 3 karakter",
    "string.max": "{{#label}} maksimal 50 karakter",
  }),

  pengguna_email: Joi.string()
    .email({ tlds: { allow: ["edu", "com"] } })
    //.required()
    .label("Email Pengguna")
    .messages({
        "string.required": "{{#label}} harus diisi yaa",
        "string.email": "{{#label}} hanya boleh diisi .edu atau .com",
  }),

  pengguna_jk: Joi.string().valid("Wanita", "Pria", "Others").required().label("Jenis Kelamin").messages({
    "any.only": "{{#label}} hanya boleh 'Wanita' atau 'Pria'",
    "any.required": "{{#label}} harus diisi",
  }),
  
  pengguna_password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base": "{{#label}} minimal 8 karakter, termasuk huruf besar, kecil, angka, dan simbol",
      "any.required": "{{#label}} harus diisi",
    }),

  pengguna_konfirmasi_password: Joi.any()
    .equal(Joi.ref("pengguna_password"))
    .label("Konfirmasi Password")
    .messages({ "any.only": "{{#label}} harus sama dengan password" 
    }),

  pengguna_birthday: Joi.date()
    .greater("1970-01-01")
    .less("now")
    .label("Birthday Pengguna")
    .iso()
    .messages({
        "date.greater": "{{#label}} harus lebih dari 1 Januari 1970",
        "date.less": "{{#label}} harus kurang dari now",
        "date.iso": "{{#label}} harus dalam format YYYY-MM-DD",
    }),

  pengguna_umur: Joi.number()
    .integer()
    .default(17)
    .min(17)
    .max(100)
    .label("Umur Pengguna")
    .messages({
        "number.min": "{{#label}} harus dalam bentuk angka antara 17-100",
        "number.max": "{{#label}} harus dalam bentuk angka antara 17-100",
    }),
    app_name: Joi.any().label("Application Name"),
    app_token: Joi.any().label("Application Token"),
    validator: Joi.array().items(Joi.valid("backend", "frontend")),
    isActive: Joi.boolean(), 
  })
  .with("app_name", "app_token")
  .messages({
    "object.with":
        "{{#mainWithLabel}} harus dikirim bersama dengan {{#peerWithLabel}}",
  });

module.exports = penggunaSchema;
