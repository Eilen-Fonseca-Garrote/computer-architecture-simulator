import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

interface StepExplanationProps {
  explanation: string
}

export function StepExplanation({ explanation }: StepExplanationProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Info className="h-4 w-4" />
          Explicación del Paso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-pretty leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation }} />
      </CardContent>
    </Card>
  )
}
