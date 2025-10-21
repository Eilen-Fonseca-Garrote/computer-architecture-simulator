import { cn } from "@/lib/utils"

interface MemoryDisplayProps {
  memory: number[]
  activeAddresses: Set<number>
}

export function MemoryDisplay({ memory, activeAddresses }: MemoryDisplayProps) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
      {memory.map((value, index) => (
        <div
          key={index}
          className={cn(
            "p-3 rounded-md border text-center transition-all duration-300 font-mono",
            activeAddresses.has(index)
              ? "bg-accent text-accent-foreground border-accent shadow-lg scale-105"
              : "bg-card border-border",
          )}
        >
          <div className="text-xs text-muted-foreground mb-1">[{index}]</div>
          <div className="text-sm font-semibold">
            {value === 0 ? "0" : value.toString(16).toUpperCase().padStart(4, "0")}
          </div>
        </div>
      ))}
    </div>
  )
}
