import { createClient } from '@supabase/supabase-js'

// Criar cliente Supabase com as variáveis de ambiente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

type RegisterData = {
  name: string
  email: string
  password: string
  phone?: string
  passwordConfirmation?: string
  acceptTerms?: boolean
}

// Registrar novo usuário
export async function register(data: RegisterData) {
  try {
    if (data.passwordConfirmation && data.password !== data.passwordConfirmation) {
      return { success: false, message: "As senhas não conferem." }
    }

    if (data.acceptTerms === false) {
      return { success: false, message: "É necessário aceitar os termos." }
    }

    const { data: user, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone
        }
      }
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Usuário registrado com sucesso!",
      user
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao registrar usuário." }
  }
}

// Login de usuário
export async function login(email: string, password: string) {
  try {
    const { data: session, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Login realizado com sucesso!",
      session
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao fazer login." }
  }
}

// Logout de usuário
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, message: error.message }
    }

    return {
      success: true,
      message: "Logout realizado com sucesso!"
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Erro ao fazer logout." }
  }
}
