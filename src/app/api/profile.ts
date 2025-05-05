import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function perfil(req: NextApiRequest, res: NextApiResponse) {
    const supabase = await createClient();
    const { user_id } = req.query;

    const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id);

    if (errorProfile) {
        return res.status(500).json({error: errorProfile.message});
    }

    if (!dataProfile) {
        return res.status(404).json({error: 'Perfil no encontrado'});
    }

    res.status(200).json(dataProfile);
}