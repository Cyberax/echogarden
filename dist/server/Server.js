import { WebSocketServer, WebSocket } from 'ws';
import { encode as encodeMsgPack, decode as decodeMsgPack } from 'msgpack-lite';
import { logToStderr } from '../utilities/Utilities.js';
import { OpenPromise } from '../utilities/OpenPromise.js';
import { existsSync, readFileAsBinary } from '../utilities/FileSystem.js';
import { extendDeep } from '../utilities/ObjectUtilities.js';
import { sendMessageToWorker, addListenerToWorkerMessages, startNewWorkerThread, startMessageChannel } from './Worker.js';
import chalk from 'chalk';
import { decodeUtf8 } from '../encodings/Utf8.js';
const log = logToStderr;
export async function startServer(serverOptions, onStarted) {
    serverOptions = extendDeep(defaultServerOptions, serverOptions);
    const wsServerOptions = {
        perMessageDeflate: serverOptions.deflate,
        maxPayload: serverOptions.maxPayload
    };
    function onHttpRequest(request, response) {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('This is the Echogarden HTTP server!');
    }
    if (serverOptions.secure) {
        if (!serverOptions.certPath || !existsSync(serverOptions.certPath)) {
            throw new Error(`No valid certificate file path was given`);
        }
        if (!serverOptions.keyPath || !existsSync(serverOptions.keyPath)) {
            throw new Error(`No valid key file path was given`);
        }
        const { createServer } = await import('https');
        const httpsServer = createServer({
            cert: Buffer.from(await readFileAsBinary(serverOptions.certPath)),
            key: Buffer.from(await readFileAsBinary(serverOptions.keyPath))
        }, onHttpRequest);
        httpsServer.listen(serverOptions.port);
        wsServerOptions.server = httpsServer;
    }
    else {
        const { createServer } = await import('http');
        const httpServer = createServer({}, onHttpRequest);
        httpServer.listen(serverOptions.port);
        wsServerOptions.server = httpServer;
    }
    const wss = new WebSocketServer(wsServerOptions);
    const requestIdToWebSocket = new Map();
    function onWorkerMessage(message) {
        if (message.name == 'writeToStdErr') {
            return;
        }
        // Remove input raw audio property from message, if exists, when using WebSocket protocol:
        message['inputRawAudio'] = undefined;
        if (!message.requestId) {
            throw new Error(`Worker message doesn't have a request ID`);
        }
        const ws = requestIdToWebSocket.get(message.requestId);
        if (!ws || ws.readyState != WebSocket.OPEN) {
            return;
        }
        const encodedWorkerMessage = encodeMsgPack(message);
        ws.send(encodedWorkerMessage);
    }
    let workerThread;
    if (serverOptions.useWorkerThread) {
        workerThread = await startNewWorkerThread();
        workerThread.on('message', onWorkerMessage);
    }
    else {
        startMessageChannel();
        addListenerToWorkerMessages(onWorkerMessage);
    }
    const serverOpenPromise = new OpenPromise;
    wss.on('listening', () => {
        log(chalk.gray(`Started Echogarden WebSocket server on port ${serverOptions.port}`));
        onStarted(serverOptions);
    });
    wss.on('close', () => {
        serverOpenPromise.resolve();
    });
    wss.on('connection', async (ws, req) => {
        log(chalk.gray((`Accepted incoming connection from ${req.socket.remoteAddress}`)));
        ws.on('message', (messageData, isBinary) => {
            if (!isBinary) {
                log(chalk.gray(`Received an unexpected string WebSocket message: '${decodeUtf8(messageData)}'`));
                return;
            }
            let incomingMessage;
            try {
                incomingMessage = decodeMsgPack(messageData);
            }
            catch (e) {
                log(chalk.gray(`Failed to decode binary WebSocket message. Reason: ${e}`));
                return;
            }
            const requestId = incomingMessage.requestId;
            if (!requestId) {
                log(chalk.gray('Received a WebSocket message without a request ID'));
                return;
            }
            requestIdToWebSocket.set(requestId, ws);
            if (workerThread) {
                workerThread.postMessage(incomingMessage);
            }
            else {
                sendMessageToWorker(incomingMessage);
            }
        });
        ws.on('error', (e) => {
            log(`${chalk.redBright('WebSocket error')}: ${e.message}`);
        });
        ws.on('close', () => {
            const keysToDelete = [];
            requestIdToWebSocket.forEach((value, key) => {
                if (value == ws) {
                    keysToDelete.push(key);
                }
            });
            keysToDelete.forEach(key => requestIdToWebSocket.delete(key));
            log(chalk.gray(`Incoming connection from ${req.socket.remoteAddress} was closed`));
        });
    });
    return serverOpenPromise.promise;
}
export const defaultServerOptions = {
    port: 45054,
    secure: false,
    certPath: undefined,
    keyPath: undefined,
    deflate: true,
    maxPayload: 1000 * 1000000, // 1GB
    useWorkerThread: true
};
//# sourceMappingURL=Server.js.map