'use client'

export function useAuth() {
  return {
    user: null,
    login: async (email: string, password: string) => {
      console.log('Simulando login de:', email)
      return Promise.resolve()
    },
    logout: async () => {
      console.log('Simulando logout...')
      return Promise.resolve()
    },
    resetPassword: async ({ email }: { email: string }) => {
      console.log('Simulando envio de recuperação de senha para:', email)
      return Promise.resolve()
    },
  }
}

