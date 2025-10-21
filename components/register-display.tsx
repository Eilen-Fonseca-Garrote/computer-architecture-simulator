import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface RegisterDisplayProps {
  registers: {
    ac: number
    pc: number
    ir: number
    mar: number
    mbr: number
  }
  activeRegisters: Set<string>
}

export function RegisterDisplay({ registers, activeRegisters }: RegisterDisplayProps) {
  const registerList = [
    { key: "ac", label: "AC", value: registers.ac, description: "Acumulador" },
    { key: "pc", label: "PC", value: registers.pc, description: "Contador de Programa" },
    {
      key: "ir",
      label: "IR",
      value: registers.ir.toString(16).toUpperCase().padStart(4, "0"),
      description: "Registro de Instrucción",
    },
    { key: "mar", label: "MAR", value: registers.mar, description: "Registro de Dirección de Memoria" },
    { key: "mbr", label: "MBR", value: registers.mbr, description: "Registro de Buffer de Memoria" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {registerList.map((register) => (
        <Card
          key={register.key}
          className={cn(
            "p-4 transition-all duration-300",
            activeRegisters.has(register.key) ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-card",
          )}
        >
          <div className="space-y-1">
            <p
              className={cn(
                "text-xs font-medium",
                activeRegisters.has(register.key) ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {register.description}
            </p>
            <p className="text-2xl font-bold font-mono">{register.label}</p>
            <p className="text-xl font-mono">{register.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
