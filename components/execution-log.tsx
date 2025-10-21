import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal } from "lucide-react"

interface ExecutionLogProps {
  logs: string[]
}

export function ExecutionLog({ logs }: ExecutionLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Terminal className="h-4 w-4" />
          Registro de Ejecución
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-4">
          <div className="space-y-1 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No hay registros aún...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-foreground">
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
