import { supabase } from './supabase'

export async function cargarPerfilPropio() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay sesión')
  const { data, error } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throw error
  return data // null si nunca ha editado
}

export async function guardarPerfilPropio(cambios) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No hay sesión')
  const { data, error } = await supabase
    .from('perfiles')
    .upsert({ id: user.id, ...cambios }, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw new Error(error.message) // aquí llega el mensaje del trigger si intenta reeditar
  return data
}