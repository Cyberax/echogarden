export function getOnnxSessionOptions(options) {
    const onnxOptions = {
        executionProviders: ['cpu'],
        logSeverityLevel: 3,
    };
    if (options) {
        if (options.executionProviders != null) {
            let executionProviders = options.executionProviders.filter(provider => {
                if (!provider) {
                    return false;
                }
                if (provider === 'dml' && !dmlProviderAvailable()) {
                    return false;
                }
                return true;
            });
            if (!executionProviders.includes('cpu')) {
                executionProviders.push('cpu');
            }
            executionProviders = Array.from(new Set(executionProviders));
            onnxOptions.executionProviders = executionProviders;
        }
        else if (options.enableGPU === true && dmlProviderAvailable()) {
            onnxOptions.executionProviders = ['dml', 'cpu'];
        }
        if (options.logSeverityLevel != null) {
            onnxOptions.logSeverityLevel = options.logSeverityLevel;
        }
    }
    return onnxOptions;
}
export function makeOnnxLikeFloat32Tensor(onnxTensor) {
    return {
        data: onnxTensor.data.slice(),
        dims: onnxTensor.dims.slice()
    };
}
export function dmlProviderAvailable() {
    const platform = process.platform;
    const arch = process.arch;
    return platform === 'win32' && arch === 'x64';
}
//# sourceMappingURL=OnnxUtilities.js.map