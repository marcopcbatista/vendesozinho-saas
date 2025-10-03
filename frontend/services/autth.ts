// Exemplo de serviço de autenticação (mock)
export async function register(data: { name: string; email: string; password: string }) {
  try {
    // Aqui futuramente você vai chamar sua API
    // Por enquanto só retorna os dados para testar
    return {
      success: true,
      message: "Usuário registrado com sucesso!",
      user: data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao registrar usuário",
    };
  }
}
