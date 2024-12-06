export declare function loadPackage(packageName: string): Promise<string>;
export declare function removePackage(packageName: string): Promise<void>;
export declare function ensureAndGetPackagesDir(): Promise<string>;
export declare function resolveToVersionedPackageNameIfNeeded(packageName: string): string;
export declare function getVersionTagFromPackageName(packageName: string): string | undefined;
export declare function resolveVersionTagForUnversionedPackageName(unversionedPackageName: string): string;
