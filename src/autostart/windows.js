import { existsSync, readFileSync } from "node:fs"
import { removeFileIfExists, writeTextFile } from "./shared.js"

export function enableWindowsAutostart(registration) {
  const script = `@echo off
${registration.command}
`
  writeTextFile(registration.windows.startupFile, script)
  removeFileIfExists(registration.windows.legacyStartupFile)
  return {
    enabled: true,
    provider: "windows-startup-folder",
  }
}

export function disableWindowsAutostart(registration) {
  removeFileIfExists(registration.windows.startupFile)
  removeFileIfExists(registration.windows.legacyStartupFile)
  return {
    enabled: false,
    provider: "windows-startup-folder",
  }
}

export function getWindowsAutostartStatus(registration) {
  const activeFile = existsSync(registration.windows.startupFile)
    ? registration.windows.startupFile
    : existsSync(registration.windows.legacyStartupFile)
      ? registration.windows.legacyStartupFile
      : null
  if (!activeFile) {
    return {
      enabled: false,
      provider: "windows-startup-folder",
      details: "",
    }
  }

  return {
    enabled: true,
    provider: "windows-startup-folder",
    details: readFileSync(activeFile, "utf8"),
  }
}
