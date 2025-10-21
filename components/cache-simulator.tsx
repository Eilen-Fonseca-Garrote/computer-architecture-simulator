"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CacheDisplay } from "@/components/cache-display"
import { ExecutionLog } from "@/components/execution-log"
import { StepExplanation } from "@/components/step-explanation"
import { Search, RotateCcw } from "lucide-react"
import { useCacheState } from "@/hooks/use-cache-state"

export function CacheSimulator() {
  const [address, setAddress] = useState("")
  const { cacheState, mappingType, setMappingType, accessMemory, resetCache, explanation, logs } = useCacheState()

  const handleAccessMemory = () => {
    if (address) {
      accessMemory(Number.parseInt(address))
      setAddress("")
    }
  }

  const getCacheDescription = () => {
    switch (mappingType) {
      case "direct":
        return "Cada bloque de memoria tiene una única posición en caché. Fácil de implementar pero puede causar conflictos."
      case "set-associative":
        return "La caché se divide en conjuntos. Cada bloque puede ir en cualquier línea de su conjunto. Balance entre flexibilidad y complejidad."
      case "fully-associative":
        return "Cualquier bloque puede ir en cualquier línea de caché. Máxima flexibilidad pero más compleja de implementar."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulación de Memoria Caché</CardTitle>
          <CardDescription>Explora diferentes estrategias de correspondencia de caché</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mapping-type">Tipo de Correspondencia</Label>
              <Select value={mappingType} onValueChange={setMappingType}>
                <SelectTrigger id="mapping-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Directa</SelectItem>
                  <SelectItem value="set-associative">Asociativa por Conjuntos</SelectItem>
                  <SelectItem value="fully-associative">Totalmente Asociativa</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground text-pretty">{getCacheDescription()}</p>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="memory-address">Dirección de Memoria (0-63)</Label>
                <Input
                  id="memory-address"
                  type="number"
                  min="0"
                  max="63"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: 42"
                  onKeyDown={(e) => e.key === "Enter" && handleAccessMemory()}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleAccessMemory} className="gap-2">
                  <Search className="h-4 w-4" />
                  Acceder
                </Button>
                <Button onClick={resetCache} variant="outline" className="gap-2 bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </div>

          {/* Cache Display */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Estado de la Caché</h3>
            <CacheDisplay cache={cacheState.cache} type={mappingType} />
          </div>

          {/* Statistics */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Accesos Totales</p>
                <p className="text-2xl font-bold text-foreground">{cacheState.accessCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aciertos</p>
                <p className="text-2xl font-bold text-chart-2">{cacheState.hitCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fallos</p>
                <p className="text-2xl font-bold text-destructive">{cacheState.accessCount - cacheState.hitCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasa de Aciertos</p>
                <p className="text-2xl font-bold text-primary">
                  {cacheState.accessCount > 0 ? ((cacheState.hitCount / cacheState.accessCount) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Explanation */}
          {explanation && <StepExplanation explanation={explanation} />}

          {/* Execution Log */}
          <ExecutionLog logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}
