"use client"

import { useState } from "react"

interface MachineState {
  ac: number
  pc: number
  ir: number
  mar: number
  mbr: number
  memory: number[]
  program: Array<{ instruction: string; address: number; line: number }>
  running: boolean
  currentStep: number
}

export function useMachineState() {
  const [machineState, setMachineState] = useState<MachineState>({
    ac: 0,
    pc: 0,
    ir: 0,
    mar: 0,
    mbr: 0,
    memory: new Array(16).fill(0),
    program: [],
    running: false,
    currentStep: 0,
  })

  const [explanation, setExplanation] = useState("")
  const [logs, setLogs] = useState<string[]>(["Sistema inicializado"])
  const [activeRegisters, setActiveRegisters] = useState<Set<string>>(new Set())
  const [activeMemory, setActiveMemory] = useState<Set<number>>(new Set())

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
  }

  const loadProgram = (programText: string) => {
    const lines = programText.split("\n")
    const program: Array<{ instruction: string; address: number; line: number }> = []
    const memory = new Array(16).fill(0)

    // Parse instructions
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toUpperCase()
      if (line === "") continue

      const parts = line.split(" ")
      const instruction = parts[0]
      const address = parts.length > 1 ? Number.parseInt(parts[1]) : 0

      let encodedInstruction = 0
      if (instruction === "LOAD") {
        encodedInstruction = 0x1000 | address
      } else if (instruction === "STORE") {
        encodedInstruction = 0x2000 | address
      } else if (instruction === "ADD") {
        encodedInstruction = 0x3000 | address
      }

      memory[i] = encodedInstruction
      program.push({ instruction, address, line: i })
    }

    // Initialize some data in memory for testing
    memory[10] = 5
    memory[11] = 3

    setMachineState({
      ac: 0,
      pc: 0,
      ir: 0,
      mar: 0,
      mbr: 0,
      memory,
      program,
      running: true,
      currentStep: 0,
    })

    setExplanation("")
    setLogs(["Programa cargado exitosamente", "Memoria inicializada con datos de prueba"])
    setActiveRegisters(new Set())
    setActiveMemory(new Set())
  }

  const stepMachine = () => {
    if (!machineState.running || machineState.pc >= machineState.program.length) {
      addLog("Ejecución completada")
      setMachineState((prev) => ({ ...prev, running: false }))
      return
    }

    const step = machineState.currentStep % 3
    let newExplanation = ""
    let newActiveRegisters = new Set<string>()
    let newActiveMemory = new Set<number>()

    setMachineState((prev) => {
      const newState = { ...prev }

      if (step === 0) {
        // FETCH
        newExplanation = "<strong>Paso 1: Búsqueda de instrucción (FETCH)</strong><br/>"
        newExplanation += `MAR ← PC (${prev.pc})<br/>`
        newExplanation += `MBR ← Memoria[MAR]<br/>`
        newExplanation += `IR ← MBR<br/>`
        newExplanation += `PC ← PC + 1`

        newState.mar = prev.pc
        newState.mbr = prev.memory[prev.mar]
        newState.ir = prev.mbr
        newState.pc = prev.pc + 1

        newActiveRegisters = new Set(["mar", "mbr", "ir", "pc"])
        newActiveMemory = new Set([prev.mar])

        addLog(`FETCH: PC=${prev.pc}, IR=${newState.ir.toString(16).toUpperCase()}`)
      } else if (step === 1) {
        // DECODE
        const opcode = (prev.ir & 0xf000) >> 12
        const address = prev.ir & 0x0fff

        newExplanation = "<strong>Paso 2: Decodificación de instrucción (DECODE)</strong><br/>"
        newExplanation += `Opcode: ${opcode}, Dirección: ${address}<br/>`

        newState.mar = address

        if (opcode === 1) {
          newExplanation += "Instrucción: LOAD (cargar dato de memoria a AC)"
        } else if (opcode === 2) {
          newExplanation += "Instrucción: STORE (guardar AC en memoria)"
        } else if (opcode === 3) {
          newExplanation += "Instrucción: ADD (sumar dato de memoria a AC)"
        }

        newActiveRegisters = new Set(["ir", "mar"])

        addLog(`DECODE: Instrucción decodificada, dirección=${address}`)
      } else if (step === 2) {
        // EXECUTE
        const opcode = (prev.ir & 0xf000) >> 12
        const address = prev.ir & 0x0fff

        newExplanation = "<strong>Paso 3: Ejecución de instrucción (EXECUTE)</strong><br/>"

        if (opcode === 1) {
          // LOAD
          newState.mbr = prev.memory[prev.mar]
          newState.ac = newState.mbr

          newExplanation += `LOAD: Cargando valor ${newState.mbr} de memoria[${address}] al registro AC`
          newActiveRegisters = new Set(["mbr", "ac"])
          newActiveMemory = new Set([prev.mar])

          addLog(`EXECUTE: LOAD ${address} → AC=${newState.ac}`)
        } else if (opcode === 2) {
          // STORE
          newState.mbr = prev.ac
          newState.memory[prev.mar] = newState.mbr

          newExplanation += `STORE: Guardando valor ${newState.ac} del registro AC a memoria[${address}]`
          newActiveRegisters = new Set(["ac", "mbr"])
          newActiveMemory = new Set([prev.mar])

          addLog(`EXECUTE: STORE AC=${newState.ac} → memoria[${address}]`)
        } else if (opcode === 3) {
          // ADD
          newState.mbr = prev.memory[prev.mar]
          newState.ac = prev.ac + newState.mbr

          newExplanation += `ADD: Sumando valor ${newState.mbr} de memoria[${address}] al registro AC (resultado: ${newState.ac})`
          newActiveRegisters = new Set(["mbr", "ac"])
          newActiveMemory = new Set([prev.mar])

          addLog(`EXECUTE: ADD ${address} (valor=${newState.mbr}) → AC=${newState.ac}`)
        }
      }

      newState.currentStep = prev.currentStep + 1
      return newState
    })

    setExplanation(newExplanation)
    setActiveRegisters(newActiveRegisters)
    setActiveMemory(newActiveMemory)
  }

  const resetMachine = () => {
    setMachineState({
      ac: 0,
      pc: 0,
      ir: 0,
      mar: 0,
      mbr: 0,
      memory: new Array(16).fill(0),
      program: [],
      running: false,
      currentStep: 0,
    })
    setExplanation("")
    setLogs(["Máquina reiniciada"])
    setActiveRegisters(new Set())
    setActiveMemory(new Set())
  }

  return {
    machineState,
    loadProgram,
    stepMachine,
    resetMachine,
    explanation,
    logs,
    activeRegisters,
    activeMemory,
  }
}
