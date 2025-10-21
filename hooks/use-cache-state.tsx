"use client"

import { useState, useEffect } from "react"

interface CacheLine {
  valid: boolean
  tag: number
  data: number
  accessTime: number
}

interface CacheState {
  cache: CacheLine[] | CacheLine[][]
  mainMemory: number[]
  accessCount: number
  hitCount: number
}

type MappingType = "direct" | "set-associative" | "fully-associative"

export function useCacheState() {
  const [mappingType, setMappingType] = useState<MappingType>("direct")
  const [cacheState, setCacheState] = useState<CacheState>({
    cache: [],
    mainMemory: Array.from({ length: 64 }, (_, i) => i),
    accessCount: 0,
    hitCount: 0,
  })
  const [explanation, setExplanation] = useState("")
  const [logs, setLogs] = useState<string[]>(["Sistema de caché inicializado"])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
  }

  const initializeCache = (type: MappingType) => {
    let cache: CacheLine[] | CacheLine[][]

    if (type === "direct") {
      cache = Array.from({ length: 8 }, () => ({
        valid: false,
        tag: 0,
        data: 0,
        accessTime: 0,
      }))
    } else if (type === "set-associative") {
      cache = Array.from({ length: 4 }, () =>
        Array.from({ length: 2 }, () => ({
          valid: false,
          tag: 0,
          data: 0,
          accessTime: 0,
        })),
      )
    } else {
      cache = Array.from({ length: 8 }, () => ({
        valid: false,
        tag: 0,
        data: 0,
        accessTime: 0,
      }))
    }

    setCacheState((prev) => ({
      ...prev,
      cache,
      accessCount: 0,
      hitCount: 0,
    }))
  }

  useEffect(() => {
    initializeCache(mappingType)
  }, [mappingType])

  const accessMemory = (address: number) => {
    if (address < 0 || address >= cacheState.mainMemory.length) {
      addLog(`Error: Dirección ${address} fuera de rango`)
      return
    }

    setCacheState((prev) => {
      const newState = { ...prev }
      newState.accessCount++

      const data = prev.mainMemory[address]
      let hit = false
      let newExplanation = `<strong>Acceso a dirección ${address} (binario: ${address.toString(2).padStart(6, "0")})</strong><br/><br/>`

      if (mappingType === "direct") {
        const indexBits = 3
        const tagBits = 3
        const index = address & 0b111
        const tag = (address >> indexBits) & 0b111

        newExplanation += `<strong>Desglose de dirección:</strong><br/>`
        newExplanation += `• Etiqueta: ${tag.toString(2).padStart(tagBits, "0")} (${tag})<br/>`
        newExplanation += `• Índice: ${index.toString(2).padStart(indexBits, "0")} (${index})<br/><br/>`

        const cache = newState.cache as CacheLine[]

        if (cache[index].valid && cache[index].tag === tag) {
          hit = true
          newState.hitCount++
          cache[index].accessTime = newState.accessCount
          newExplanation += `<span style="color: #10b981; font-weight: bold;">✓ ACIERTO</span> - Datos encontrados en línea ${index}: ${cache[index].data}`
        } else {
          newExplanation += `<span style="color: #ef4444; font-weight: bold;">✗ FALLO</span> - Datos no encontrados en caché<br/>`
          newExplanation += `Cargando desde memoria principal...<br/>`
          cache[index] = {
            valid: true,
            tag,
            data,
            accessTime: newState.accessCount,
          }
          newExplanation += `Línea ${index} actualizada con etiqueta ${tag} y dato ${data}`
        }
      } else if (mappingType === "set-associative") {
        const indexBits = 2
        const tagBits = 4
        const index = address & 0b11
        const tag = (address >> indexBits) & 0b1111

        newExplanation += `<strong>Desglose de dirección:</strong><br/>`
        newExplanation += `• Etiqueta: ${tag.toString(2).padStart(tagBits, "0")} (${tag})<br/>`
        newExplanation += `• Índice (conjunto): ${index.toString(2).padStart(indexBits, "0")} (${index})<br/><br/>`

        const cache = newState.cache as CacheLine[][]
        const set = cache[index]

        let foundWay = -1
        for (let way = 0; way < set.length; way++) {
          if (set[way].valid && set[way].tag === tag) {
            hit = true
            foundWay = way
            newState.hitCount++
            set[way].accessTime = newState.accessCount
            newExplanation += `<span style="color: #10b981; font-weight: bold;">✓ ACIERTO</span> - Datos encontrados en conjunto ${index}, vía ${way}: ${set[way].data}`
            break
          }
        }

        if (!hit) {
          newExplanation += `<span style="color: #ef4444; font-weight: bold;">✗ FALLO</span> - Datos no encontrados en el conjunto<br/>`
          newExplanation += `Cargando desde memoria principal...<br/>`

          let lruWay = 0
          let lruTime = set[0].accessTime
          for (let way = 1; way < set.length; way++) {
            if (set[way].accessTime < lruTime) {
              lruWay = way
              lruTime = set[way].accessTime
            }
          }

          set[lruWay] = {
            valid: true,
            tag,
            data,
            accessTime: newState.accessCount,
          }
          newExplanation += `Reemplazando vía ${lruWay} con etiqueta ${tag} y dato ${data}`
        }
      } else {
        const tag = address

        newExplanation += `<strong>Desglose de dirección:</strong><br/>`
        newExplanation += `• Etiqueta: ${tag.toString(2).padStart(6, "0")} (${tag})<br/><br/>`

        const cache = newState.cache as CacheLine[]

        let foundLine = -1
        for (let i = 0; i < cache.length; i++) {
          if (cache[i].valid && cache[i].tag === tag) {
            hit = true
            foundLine = i
            newState.hitCount++
            cache[i].accessTime = newState.accessCount
            newExplanation += `<span style="color: #10b981; font-weight: bold;">✓ ACIERTO</span> - Datos encontrados en línea ${i}: ${cache[i].data}`
            break
          }
        }

        if (!hit) {
          newExplanation += `<span style="color: #ef4444; font-weight: bold;">✗ FALLO</span> - Datos no encontrados en caché<br/>`
          newExplanation += `Cargando desde memoria principal...<br/>`

          let replaceLine = cache.findIndex((line) => !line.valid)
          if (replaceLine === -1) {
            replaceLine = 0
            let lruTime = cache[0].accessTime
            for (let i = 1; i < cache.length; i++) {
              if (cache[i].accessTime < lruTime) {
                replaceLine = i
                lruTime = cache[i].accessTime
              }
            }
          }

          cache[replaceLine] = {
            valid: true,
            tag,
            data,
            accessTime: newState.accessCount,
          }
          newExplanation += `${replaceLine !== -1 ? "Usando" : "Reemplazando"} línea ${replaceLine} con etiqueta ${tag} y dato ${data}`
        }
      }

      setExplanation(newExplanation)
      addLog(`Acceso ${newState.accessCount}: Dir ${address} - ${hit ? "ACIERTO" : "FALLO"} - Dato: ${data}`)

      return newState
    })
  }

  const resetCache = () => {
    initializeCache(mappingType)
    setExplanation("")
    setLogs(["Caché reiniciada"])
  }

  return {
    cacheState,
    mappingType,
    setMappingType,
    accessMemory,
    resetCache,
    explanation,
    logs,
  }
}
