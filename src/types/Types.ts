export type Profile = {
    id: string,
    user_id: string,
    nombre: string,
    apellido: string,
    puesto: string,
    telefono_empresa: string,
    email: string,
    telefono_personal: string,
    email_personal: string,
    horas_semana: number,
    image: string,
    estado: string,
    alta: boolean,
    is_admin: boolean,
    zona_horaria: string,
    hora_fin_lunes: Date,
    hora_fin_martes: Date,
    hora_fin_miercoles: Date,
    hora_fin_jueves: Date,
    hora_fin_viernes: Date,
    dias_vacaciones: string,
    precio_hora: string
}

export type Equipo = {
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    image: string,
    estado: string,
    horas_semana: number,
    hora_fin_lunes: Date,
    hora_fin_martes: Date,
    hora_fin_miercoles: Date,
    hora_fin_jueves: Date,
    hora_fin_viernes: Date,
    fichaje_jornada: Fichaje_jornada[]
}

export type Fichaje_jornada = {
    id: string,
    date: Date,
    date_final_aprox: Date,
    //total_trabajado: string,
    profile_id: string,
    comentario: string,
    fichaje_eventos: Fichaje_eventos[]
}

export type Fichaje_eventos = {
    id: string,
    fichaje_id: string,
    evento: string,
    date: Date,
    localizacion: string,
    modificado: boolean,
}

export type SolicitudesType = {
    id: string,
    created_at: Date,
    profile_id: string,
    fichaje_evento_id: string,
    fecha_original: Date,
    fecha_solicitada: Date,
    evento: string,
    estado: string,
    motivo: string,
    fecha_revision: Date | null
}