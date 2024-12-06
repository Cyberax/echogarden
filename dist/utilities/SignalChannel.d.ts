export declare class SignalChannel {
    channel: MessageChannel;
    handlers: Map<string, SignalChannelHandler>;
    constructor();
    on(signalName: string, handler: SignalChannelHandler): void;
    send(signalName: string, data?: any): void;
}
export type SignalChannelHandler = (data?: any) => void;
