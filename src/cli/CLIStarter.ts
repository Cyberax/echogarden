import { resolveToModuleRootDir } from '../utilities/FileSystem.js'
import { delay, setupProgramTerminationListeners, setupUnhandledExceptionListeners, writeToStderr } from '../utilities/Utilities.js'
import { Worker } from 'node:worker_threads'

setupUnhandledExceptionListeners()

setupProgramTerminationListeners(() => {
	writeToStderr('\n')
})

const worker = new Worker(resolveToModuleRootDir("dist/cli/cli.js"), {
	argv: process.argv.slice(2)
})

worker.postMessage({
	name: 'init',
	stdErrIsTTY: process.stderr.isTTY,
	stdErrHasColors: process.stderr.hasColors ? process.stderr.hasColors() : false
})

process.stdin.on('keypress', (str, key) => {
	worker.postMessage({
		name: 'keypress',
		str,
		key
	})
})

worker.on("message", (message) => {
	if (message.name == "writeToStdErr") {
		writeToStderr(message.text)
	}
})

worker.on("exit", (err) => {
	process.exit(err ? 1 : 0)
})
