export class BodyDatosPost{
  constructor(
    tipo:String,
    ticket:String,
    tema:String,
    descripcion:String,
    solicitante:String,
    gerencia:String,
    fechaSol:String,
    responsable:String,
    caso:String,
    requerido:String,
    deLey:String,
    observaciones:String,
    numeroCaso:String
  ){}
}

export class BodyDatosPostGestion{
  constructor(
    fechaDesc:String,
    responsable:String,
    ticket:String,
    desc:String
  ){}
}

export class BodyDatosPostPersona{
  constructor(
    numIdentificacion:String,
    nombres:String,
    apellidos:String,
    direccion:String,
    telefono:String,
    email:String,
    fechaNacimiento:String,
    sexo:String,
    actividad:String,
    estado:String,
  ){}
}
