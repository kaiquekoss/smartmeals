import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ArrowRight, Utensils, BarChart3, Filter, Calendar } from "lucide-react"
import Image from "next/image"

export default async function LandingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                Controle nutricional simplificado
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Gerencie suas refeições com <span className="text-primary">inteligência</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-[600px]">
                SmartMeals ajuda você a acompanhar sua nutrição diária, monitorar calorias e fazer escolhas alimentares
                mais saudáveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {session ? (
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link href="/dashboard">
                      Acessar Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/register">
                        Comece Agora
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                      <Link href="/login">Já tenho uma conta</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-square">
                <Image
                  src="/vibrant-healthy-plate.png"
                  alt="Refeição saudável"
                  fill
                  className="object-cover rounded-2xl shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Recursos que transformam sua alimentação
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Tudo o que você precisa para uma gestão nutricional eficiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cadastro de Refeições</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Registre facilmente suas refeições com nome, descrição, calorias e horário
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Filtros Inteligentes</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Filtre suas refeições por tipo (café da manhã, almoço, lanche, jantar) e data
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dashboard de Calorias</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Visualize o total de calorias consumidas por dia e acompanhe seu progresso
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Acesso Seguro</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Login seguro por e-mail e senha para proteger seus dados nutricionais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Como Funciona</h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Três passos simples para começar a controlar sua alimentação
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full h-0.5 w-full bg-primary/30"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Crie sua conta</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Registre-se gratuitamente com seu e-mail e senha para começar a usar o SmartMeals
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full h-0.5 w-full bg-primary/30"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">Registre suas refeições</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Adicione suas refeições diárias com detalhes como nome, calorias e horário
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Acompanhe seu progresso</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Visualize estatísticas e monitore sua ingestão calórica diária no dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">O que nossos usuários dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">M</span>
                </div>
                <div>
                  <h4 className="font-bold">Mariana Silva</h4>
                  <p className="text-sm text-gray-500">Nutricionista</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "O SmartMeals revolucionou a forma como acompanho a alimentação dos meus pacientes. Interface intuitiva
                e dados precisos!"
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">R</span>
                </div>
                <div>
                  <h4 className="font-bold">Rafael Costa</h4>
                  <p className="text-sm text-gray-500">Atleta amador</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Finalmente consigo acompanhar minhas calorias de forma simples. Perdi 5kg em 2 meses com a ajuda do
                app!"
              </p>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="font-bold text-primary">C</span>
                </div>
                <div>
                  <h4 className="font-bold">Carla Mendes</h4>
                  <p className="text-sm text-gray-500">Estudante</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "App super fácil de usar! Me ajudou a criar hábitos alimentares mais saudáveis durante a faculdade."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Pronto para transformar sua alimentação?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Junte-se a milhares de pessoas que já estão melhorando seus hábitos alimentares com o SmartMeals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {session ? (
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/register">
                      Comece Agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent border-white hover:bg-white/10">
                    <Link href="/login">Já tenho uma conta</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="font-bold text-xl">SmartMeals</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p className="text-sm text-gray-500">© 2023 SmartMeals. Todos os direitos reservados.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                  Termos de Uso
                </Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-primary">
                  Privacidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 