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
    observaciones:String
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
