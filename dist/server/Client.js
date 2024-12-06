import { WebSocket } from 'ws';
import { encode as encodeMsgPack, decode as decodeMsgPack } from 'msgpack-lite';
import { getRandomHexString, logToStderr } from '../utilities/Utilities.js';
import { OpenPromise } from '../utilities/OpenPromise.js';
import { Worker as WorkerThread } from 'node:worker_threads';
import { decodeUtf8 } from '../encodings/Utf8.js';
const log = logToStderr;
export class Client {
    sendMessage;
    responseListeners = new Map();
    constructor(sourceChannel) {
        if (sourceChannel instanceof WebSocket) {
            sourceChannel.on('message', (messageData, isBinary) => {
                if (!isBinary) {
                    log(`Received an unexpected string WebSocket message: '${decodeUtf8(messageData)}'`);
                    return;
                }
                let incomingMessage;
                try {
                    incomingMessage = decodeMsgPack(messageData);
                }
                catch (e) {
                    log(`Failed to decode incoming message. Reason: ${e}`);
                    return;
                }
                this.onMessage(incomingMessage);
            });
            this.sendMessage = (outgoingMessage) => {
                const encodedMessage = encodeMsgPack(outgoingMessage);
                sourceChannel.send(encodedMessage);
            };
        }
        else if (sourceChannel instanceof WorkerThread) {
            sourceChannel.on('message', (message) => {
                this.onMessage(message);
            });
            sourceChannel.on('error', (e) => {
                throw e;
            });
            this.sendMessage = (outgoingMessage) => {
                sourceChannel.postMessage(outgoingMessage);
            };
        }
        else {
            throw new Error(`Invalid source: not a WebSocket or WorkerThread object`);
        }
    }
    async synthesize(input, options, onSegment, onSentence) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'SynthesisRequest',
            input,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'SynthesisResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
            else if (responseMessage.messageType == 'SynthesisSegmentEvent' && onSegment) {
                onSegment(responseMessage);
            }
            else if (responseMessage.messageType == 'SynthesisSentenceEvent' && onSentence) {
                onSentence(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async requestVoiceList(options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'VoiceListRequest',
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'VoiceListResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async recognize(input, options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'RecognitionRequest',
            input,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'RecognitionResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async align(input, transcript, options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'AlignmentRequest',
            input,
            transcript,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'AlignmentResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async translateSpeech(input, options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'SpeechTranslationRequest',
            input,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'SpeechTranslationResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async detectSpeechLanguage(input, options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'SpeechLanguageDetectionRequest',
            input,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'SpeechLanguageDetectionResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    async detectTextLanguage(input, options) {
        const requestOpenPromise = new OpenPromise();
        const requestMessage = {
            messageType: 'TextLanguageDetectionRequest',
            input,
            options
        };
        function onResponse(responseMessage) {
            if (responseMessage.messageType == 'TextLanguageDetectionResponse') {
                requestOpenPromise.resolve(responseMessage);
            }
        }
        function onError(e) {
            requestOpenPromise.reject(e);
        }
        try {
            this.sendRequest(requestMessage, onResponse, onError);
        }
        catch (e) {
            onError(e);
        }
        return requestOpenPromise.promise;
    }
    sendRequest(request, onResponse, onErrorResponse) {
        const requestId = getRandomHexString();
        request = {
            requestId,
            ...request
        };
        this.sendMessage(request);
        function onResponseMessage(message) {
            if (message.messageType == 'Error') {
                onErrorResponse(message.error);
            }
            else {
                onResponse(message);
            }
        }
        this.responseListeners.set(requestId, onResponseMessage);
    }
    onMessage(incomingMessage) {
        const requestId = incomingMessage.requestId;
        if (!requestId) {
            log('Received a WebSocket message without a request ID');
            return;
        }
        const listener = this.responseListeners.get(requestId);
        if (listener) {
            listener(incomingMessage);
        }
    }
}
//# sourceMappingURL=Client.js.map