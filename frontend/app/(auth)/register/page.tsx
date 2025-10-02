"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/services/auth";

type RegisterFormData = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone || undefined,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
        acceptTerms: formData.acceptTerms,
      });

      router.push("/login");
    } catch (error) {
      console.error("Erro no registro:", error);
      alert("Falha ao registrar. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Conta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              {...register("name", { required: "Nome é obrigatório" })}
              className="w-full border rounded p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email é obrigatório" })}
              className="w-full border rounded p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              {...register("password", { required: "Senha é obrigatória" })}
              className="w-full border rounded p-2"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              {...register("passwordConfirmation", {
                required: "Confirme sua senha",
              })}
              className="w-full border rounded p-2"
            />
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          {/* Aceitar Termos */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("acceptTerms", {
                required: "Você deve aceitar os termos",
              })}
              className="mr-2"
            />
            <span className="text-sm">Aceito os termos de uso</span>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">
              {errors.acceptTerms.message?.toString()}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
