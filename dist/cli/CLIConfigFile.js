import { readAndParseJsonFile, readFileAsUtf8 } from '../utilities/FileSystem.js';
export async function parseConfigFile(path) {
    const fileContent = await readFileAsUtf8(path);
    const lines = fileContent
        .split(/\r?\n/g)
        .map(line => line.trim());
    const sectionRegExp = /^\s*\[(.*)\]\s*$/;
    const sectionMap = new Map();
    let currentSectionName = '';
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        if (line.length == 0 || line.startsWith('#')) {
            continue;
        }
        const sectionMatch = sectionRegExp.exec(line);
        if (sectionMatch) {
            currentSectionName = sectionMatch[1];
            continue;
        }
        if (!(sectionMap.has(currentSectionName))) {
            sectionMap.set(currentSectionName, new Map());
        }
        const splitPoint = line.indexOf('=');
        let key;
        let value;
        if (splitPoint == 0) {
            throw new Error(`Invalid empty key on line ${lineIndex + 1}`);
        }
        else if (splitPoint > 0) {
            key = line.substring(0, splitPoint).trim();
            value = line.substring(splitPoint + 1).trim();
            if (value) {
                sectionMap.get(currentSectionName).set(key, value);
            }
        }
    }
    return sectionMap;
}
export async function parseJSONConfigFile(path) {
    const parsedJSON = await readAndParseJsonFile(path, true);
    const result = new Map();
    for (const operation in parsedJSON) {
        const operationObj = parsedJSON[operation];
        const operationMap = new Map();
        function addFromObject(obj, pathPrefix) {
            for (const propertyName in obj) {
                const propertyValue = obj[propertyName];
                const propertyPath = pathPrefix == '' ? propertyName : `${pathPrefix}.${propertyName}`;
                if (typeof propertyValue == 'object') {
                    if (Array.isArray(propertyValue)) {
                        operationMap.set(propertyPath, JSON.stringify(propertyValue));
                    }
                    else {
                        addFromObject(propertyValue, propertyPath);
                    }
                }
                else {
                    operationMap.set(propertyPath, propertyValue);
                }
            }
        }
        addFromObject(operationObj, '');
        result.set(operation, operationMap);
    }
    return result;
}
//# sourceMappingURL=CLIConfigFile.js.map