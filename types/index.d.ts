/**
 * escape map for win32
 * @type {Record<string,string>}
 */
export const MAP_WIN: Record<string, string>;
/**
 * escape map for *nix
 * @type {Record<string,string>}
 */
export const MAP_NIX: Record<string, string>;
export function replace(str?: string, options?: {
    filter?: boolean | undefined;
    isWin32?: boolean | undefined;
    map?: Record<string, string> | undefined;
    filterMap?: Record<string, string> | undefined;
} | undefined): string;
export function escapeCommand(string: string): string;
export function escapeCommandLit(literals: any, ...vars: any[]): string;
export function filterCommand(string: string): string;
export function filterCommandLit(literals: any, ...vars: any[]): string;
