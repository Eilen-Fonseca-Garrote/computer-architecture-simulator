import { HypotheticalMachine } from "@/components/hypothetical-machine"
import { CacheSimulator } from "@/components/cache-simulator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cpu, Database } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Simulador de Arquitectura de Computadoras
          </h1>
          <p className="text-muted-foreground text-pretty">
            Herramienta educativa para comprender el ciclo fetch-decode-execute y sistemas de memoria caché
          </p>
        </header>

        <Tabs defaultValue="machine" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="machine" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Máquina Hipotética
            </TabsTrigger>
            <TabsTrigger value="cache" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Memoria Caché
            </TabsTrigger>
          </TabsList>

          <TabsContent value="machine" className="space-y-6">
            <HypotheticalMachine />
          </TabsContent>

          <TabsContent value="cache" className="space-y-6">
            <CacheSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
