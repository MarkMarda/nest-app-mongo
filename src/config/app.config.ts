export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'env',
  mongoDB: process.env.MONGO_DB,
  port: process.env.PORT || 8004,
  //Para evitar desplegar toda la base de datos "+", se usa tambien
  //porque viene de la validacion de joi.ValidatioSchema como number
  //pero es string porque se manda literalmente a la variable
  //de entorno
  defaultLimit: +process.env.DEFAULT_LIMIT || 15,
});

//Se usa en el modulo dentro de NEST no llega al main
//por eso si no se define en la variable de entorno es undefined
//porque no se establecen en la variable de entorno que es el objeto
//que esta en Node.
//Los que estan fuera del modulo se puede usar proces.env.VARIABLE
//tomando en cuenta el punto anterior.
