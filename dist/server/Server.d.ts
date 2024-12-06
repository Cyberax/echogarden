export declare function startServer(serverOptions: ServerOptions, onStarted: (options: ServerOptions) => void): Promise<void>;
export interface ServerOptions {
    port?: number;
    secure?: boolean;
    certPath?: string;
    keyPath?: string;
    deflate?: boolean;
    maxPayload?: number;
    useWorkerThread?: boolean;
}
export declare const defaultServerOptions: ServerOptions;
