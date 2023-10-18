export interface GetTickets {
  descTipo: string;
  ticket: string;
  descTema: number;
  descricion: string;
  solicitante: string;
  descGerencia: string;
  fechaSol: Date;
  responsable: string;
  descCaso: string;
  descRequerido: string;
  descDeLey: string;
  observaciones: string;
}

export interface GetGestionTickets{
  descripcion: string;
  responsableId: string;
  fechaDescri: string;
  ticketId: string;
}

export interface GetPersona{
  numeroIdentificacion: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  sexo: string;
  actividad: string;
  desActividad: string;
}
