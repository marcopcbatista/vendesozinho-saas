import { z } from "zod"

// Schema corrigido
const registerSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail invÃ¡lido"),
  password: z.string().min(6, "Senha muito curta"),
  passwordConfirmation: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "VocÃª precisa aceitar os termos"
  })
}).refine(data => data.password === data.passwordConfirmation, {
  path: ["passwordConfirmation"],
  message: "As senhas nÃ£o conferem"
})

// SimulaÃ§Ã£o de dados
const result = registerSchema.safeParse({
  name: "JoÃ£o",
  email: "joao@example.com",
  password: "123456",
  passwordConfirmation: "123456",
  acceptTerms: false // mude aqui pra true/false e teste
})

console.log(result)

