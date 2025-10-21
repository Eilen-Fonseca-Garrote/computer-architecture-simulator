import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CacheLine {
  valid: boolean
  tag: number
  data: number
  accessTime: number
}

interface CacheDisplayProps {
  cache: CacheLine[] | CacheLine[][]
  type: "direct" | "set-associative" | "fully-associative"
}

export function CacheDisplay({ cache, type }: CacheDisplayProps) {
  if (type === "set-associative") {
    return (
      <div className="space-y-4">
        {(cache as CacheLine[][]).map((set, setIndex) => (
          <Card key={setIndex} className="overflow-hidden">
            <div className="bg-muted px-4 py-2">
              <h4 className="font-semibold text-sm">Conjunto {setIndex}</h4>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Vía</TableHead>
                  <TableHead className="w-20">Válido</TableHead>
                  <TableHead>Etiqueta</TableHead>
                  <TableHead>Dato</TableHead>
                  <TableHead className="w-32">Último Acceso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {set.map((line, wayIndex) => (
                  <TableRow key={wayIndex} className={cn(line.valid && "bg-muted/30")}>
                    <TableCell className="font-mono">{wayIndex}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          line.valid ? "bg-chart-2 text-white" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {line.valid ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">{line.tag.toString(2).padStart(4, "0")}</TableCell>
                    <TableCell className="font-mono font-semibold">{line.data}</TableCell>
                    <TableCell className="font-mono text-muted-foreground">{line.accessTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Línea</TableHead>
            <TableHead className="w-20">Válido</TableHead>
            <TableHead>Etiqueta</TableHead>
            <TableHead>Dato</TableHead>
            <TableHead className="w-32">Último Acceso</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(cache as CacheLine[]).map((line, index) => (
            <TableRow key={index} className={cn(line.valid && "bg-muted/30")}>
              <TableCell className="font-mono">{index}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    line.valid ? "bg-chart-2 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {line.valid ? "Sí" : "No"}
                </span>
              </TableCell>
              <TableCell className="font-mono">
                {line.tag.toString(2).padStart(type === "direct" ? 3 : 6, "0")}
              </TableCell>
              <TableCell className="font-mono font-semibold">{line.data}</TableCell>
              <TableCell className="font-mono text-muted-foreground">{line.accessTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
