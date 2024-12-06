import { request } from 'gaxios';
export async function getPackageLatestVersion(packageName, timeout = 10000) {
    const response = await request({
        method: 'GET',
        url: `https://registry.npmjs.org/${packageName}/latest`,
        params: {},
        headers: {},
        responseType: 'json',
        timeout,
    });
    const result = response.data;
    return result.version;
}
//# sourceMappingURL=NpmUtilities.js.map