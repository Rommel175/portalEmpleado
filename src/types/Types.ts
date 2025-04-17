export type Profile = {
    id: string,
    user_id: string,
    nombre: string,
    apellido: string,
    puesto: string,
    telefono_empresa: string,
    email: string,
    telefono_personal: string,
    emial_personal: string,
    horas_semana: number,
    image: string,
    estado: string,
    alta: boolean,
    is_admin: boolean
}

export type Equipo = {
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    image: string,
    estado: string,
    horas_semana: number,
    fichaje_jornada: Fichaje_jornada[]
}

export type Fichaje_jornada = {
    id: string,
    date: Date,
    date_final_aprox: Date,
    total_trabajado: string,
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
}