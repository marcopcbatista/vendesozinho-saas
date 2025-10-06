// Exemplo de serviÃ§o de autenticaÃ§Ã£o (mock)
export async function register(data: { name: string; email: string; password: string }) {
  try {
    // Aqui futuramente vocÃª vai chamar sua API
    // Por enquanto sÃ³ retorna os dados para testar
    return {
      success: true,
      message: "UsuÃ¡rio registrado com sucesso!",
      user: data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao registrar usuÃ¡rio",
    };
  }
}

