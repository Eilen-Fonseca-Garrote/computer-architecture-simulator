"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RegisterDisplay } from "@/components/register-display"
import { MemoryDisplay } from "@/components/memory-display"
import { ExecutionLog } from "@/components/execution-log"
import { StepExplanation } from "@/components/step-explanation"
import { Play, RotateCcw, Upload } from "lucide-react"
import { useMachineState } from "@/hooks/use-machine-state"

const DEFAULT_PROGRAM = `LOAD 10
ADD 11
STORE 12
LOAD 12`

export function HypotheticalMachine() {
  const [programCode, setProgramCode] = useState(DEFAULT_PROGRAM)
  const { machineState, loadProgram, stepMachine, resetMachine, explanation, logs, activeRegisters, activeMemory } =
    useMachineState()

  const handleLoadProgram = () => {
    loadProgram(programCode)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulación de Máquina Hipotética</CardTitle>
          <CardDescription>Visualiza el ciclo fetch-decode-execute paso a paso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Registers */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Registros</h3>
            <RegisterDisplay registers={machineState} activeRegisters={activeRegisters} />
          </div>

          {/* Memory */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Memoria</h3>
            <MemoryDisplay memory={machineState.memory} activeAddresses={activeMemory} />
          </div>

          {/* Program Input */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Programa</h3>
            <Textarea
              value={programCode}
              onChange={(e) => setProgramCode(e.target.value)}
              rows={8}
              className="font-mono text-sm"
              placeholder="Ingrese su programa aquí..."
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleLoadProgram} className="gap-2">
                <Upload className="h-4 w-4" />
                Cargar Programa
              </Button>
              <Button onClick={stepMachine} disabled={!machineState.running} variant="secondary" className="gap-2">
                <Play className="h-4 w-4" />
                Ejecutar Paso
              </Button>
              <Button onClick={resetMachine} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reiniciar
              </Button>
            </div>
          </div>

          {/* Explicación */}
          {explanation && <StepExplanation explanation={explanation} />}

          {/* Log Ejecución */}
          <ExecutionLog logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}
