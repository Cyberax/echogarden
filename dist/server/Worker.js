import { requestVoiceList, synthesize } from '../api/Synthesis.js';
import { Queue } from '../data-structures/Queue.js';
import { logToStderr, yieldToEventLoop } from '../utilities/Utilities.js';
import { recognize } from '../api/Recognition.js';
import { align } from '../api/Alignment.js';
import { translateSpeech } from '../api/SpeechTranslation.js';
import { resetActiveLogger } from '../utilities/Logger.js';
import { writeToStderr } from '../utilities/Utilities.js';
import { Worker, SHARE_ENV } from 'node:worker_threads';
import { detectSpeechLanguage } from '../api/SpeechLanguageDetection.js';
import chalk from 'chalk';
import { resolveToModuleRootDir } from '../utilities/PathUtilities.js';
import { detectTextLanguage } from '../api/TextLanguageDetection.js';
const log = logToStderr;
let messageChannel = undefined;
const canceledRequests = new Set();
let cancelCurrentTask = false;
const messageQueue = new Queue();
let isProcessing = false;
export function startMessageChannel() {
    if (messageChannel != null) {
        return;
    }
    messageChannel = new MessageChannel();
    messageChannel.port1.start();
    messageChannel.port2.start();
    addListenerToClientMessages((message) => {
        if (message.messageType == 'CancelationRequest' || message.messageType == 'CancellationRequest') {
            //log(`CANCEL REQUESTED FOR ${message.requestId}`)
            canceledRequests.add(message.requestId);
            return;
        }
        enqueueAndProcessIfIdle(message);
    });
}
export function shouldCancelCurrentTask() {
    return cancelCurrentTask;
}
function enqueueAndProcessIfIdle(message) {
    messageQueue.enqueue(message);
    processQueueIfIdle();
}
async function processQueueIfIdle() {
    if (isProcessing) {
        return;
    }
    isProcessing = true;
    while (!messageQueue.isEmpty) {
        const incomingMessage = messageQueue.dequeue();
        const requestId = incomingMessage.requestId;
        function sendMessage(outgoingMessage) {
            sendMessageToClient({
                requestId,
                ...outgoingMessage,
            });
        }
        function setCancellationFlagIfNeeded() {
            if (canceledRequests.has(requestId)) {
                cancelCurrentTask = true;
                canceledRequests.delete(requestId);
            }
        }
        await yieldToEventLoop();
        setCancellationFlagIfNeeded();
        const cancellationFlagSetterInterval = setInterval(setCancellationFlagIfNeeded, 20);
        try {
            if (cancelCurrentTask) {
                //log(`******* CANCELED BEFORE START: ${requestId} *******`)
                throw new Error('Canceled');
            }
            await processMessage(incomingMessage, sendMessage);
        }
        catch (e) {
            log(`${chalk.redBright('Error')}: ${e.message}`);
            sendMessageToClient({
                requestId,
                messageType: 'Error',
                error: e
            });
        }
        finally {
            resetActiveLogger();
            clearInterval(cancellationFlagSetterInterval);
            cancelCurrentTask = false;
        }
    }
    isProcessing = false;
}
export async function processMessage(message, sendMessage) {
    switch (message.messageType) {
        case 'SynthesisRequest': {
            await processSynthesisRequest(message, sendMessage);
            break;
        }
        case 'VoiceListRequest': {
            await processVoiceListRequest(message, sendMessage);
            break;
        }
        case 'RecognitionRequest': {
            await processRecognitionRequest(message, sendMessage);
            break;
        }
        case 'AlignmentRequest': {
            await processAlignmentRequest(message, sendMessage);
            break;
        }
        case 'SpeechTranslationRequest': {
            await processSpeechTranslationRequest(message, sendMessage);
            break;
        }
        case 'SpeechLanguageDetectionRequest': {
            await processSpeechLanguageDetectionRequest(message, sendMessage);
            break;
        }
        case 'TextLanguageDetectionRequest': {
            await processTextLanguageDetectionRequest(message, sendMessage);
            break;
        }
        default: {
            throw new Error(`Invalid message type: ${message.messageType}`);
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Synthesis operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processSynthesisRequest(message, sendMessage) {
    async function onSegment(eventData) {
        const responseMessage = {
            messageType: 'SynthesisSegmentEvent',
            ...eventData
        };
        sendMessage(responseMessage);
    }
    async function onSentence(eventData) {
        const responseMessage = {
            messageType: 'SynthesisSentenceEvent',
            ...eventData
        };
        sendMessage(responseMessage);
    }
    const result = await synthesize(message.input, message.options, onSegment, onSentence);
    const responseMessage = {
        messageType: 'SynthesisResponse',
        ...result
    };
    sendMessage(responseMessage);
}
async function processVoiceListRequest(message, sendMessage) {
    const result = await requestVoiceList(message.options);
    const responseMessage = {
        messageType: 'VoiceListResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Recognition operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processRecognitionRequest(message, sendMessage) {
    const result = await recognize(message.input, message.options);
    const responseMessage = {
        messageType: 'RecognitionResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Alignment operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processAlignmentRequest(message, sendMessage) {
    const result = await align(message.input, message.transcript, message.options);
    const responseMessage = {
        messageType: 'AlignmentResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Speech translation operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processSpeechTranslationRequest(message, sendMessage) {
    const result = await translateSpeech(message.input, message.options);
    const responseMessage = {
        messageType: 'SpeechTranslationResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Speech Language detection operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processSpeechLanguageDetectionRequest(message, sendMessage) {
    const result = await detectSpeechLanguage(message.input, message.options);
    const responseMessage = {
        messageType: 'SpeechLanguageDetectionResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Text Language detection operations
///////////////////////////////////////////////////////////////////////////////////////////////
async function processTextLanguageDetectionRequest(message, sendMessage) {
    const result = await detectTextLanguage(message.input, message.options);
    const responseMessage = {
        messageType: 'TextLanguageDetectionResponse',
        ...result
    };
    sendMessage(responseMessage);
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Messaging methods
///////////////////////////////////////////////////////////////////////////////////////////////
export function sendMessageToWorker(message) {
    ensureMessageChannelCreated();
    messageChannel?.port1.postMessage(message);
}
export function addListenerToWorkerMessages(handler) {
    ensureMessageChannelCreated();
    messageChannel?.port1.addEventListener('message', (event) => {
        handler(event.data);
    });
}
function sendMessageToClient(message) {
    ensureMessageChannelCreated();
    messageChannel?.port2.postMessage(message);
}
function addListenerToClientMessages(handler) {
    ensureMessageChannelCreated();
    messageChannel?.port2.addEventListener('message', (event) => {
        handler(event.data);
    });
}
function ensureMessageChannelCreated() {
    if (messageChannel == null) {
        throw new Error(`Message channel has not been created`);
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////
// Worker thread methods
///////////////////////////////////////////////////////////////////////////////////////////////
export async function startNewWorkerThread() {
    const workerThread = new Worker(resolveToModuleRootDir('dist/server/WorkerStarter.js'), {
        argv: process.argv.slice(2),
        env: SHARE_ENV
    });
    workerThread.on('message', (message) => {
        if (message.name == 'writeToStdErr') {
            writeToStderr(message.text);
        }
    });
    workerThread.postMessage({
        name: 'init',
        stdErrIsTTY: process.stderr.isTTY,
        stdErrHasColors: process.stderr.hasColors ? process.stderr.hasColors() : false
    });
    return workerThread;
}
//# sourceMappingURL=Worker.js.map