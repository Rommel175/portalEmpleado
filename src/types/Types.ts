export type Profile = {
    id: string,
    user_id: string,
    full_name: string,
    email: string,
    image: string,
    estado: string,
    puesto: string,
    emial_personal: string,
    telefono_empresa: string,
    telefono_personal: string,
    alta: boolean,
    is_admin: boolean
}

export type Equipo = {
    id: string,
    full_name: string,
    email: string,
    image: string,
    estado: string,
    fichaje_jornada: Fichaje_jornada[]
}

export type Fichaje_jornada = {
    id: string,
    created_at: string,
    total_trabajado: string,
    hora_aprox_salida: string,
    profile_id: string,
    hora: string,
    fichaje_eventos: Fichaje_eventos[]
}

export type Fichaje_eventos = {
    id: string,
    fichaje_id: string,
    evento: string,
    hora: string,
    localizacion: string,
}