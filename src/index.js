import os from 'node:os'

/**
 * @credits OWASP
 * @see https://wiki.owasp.org/index.php/Testing_for_Command_Injection_(OTG-INPVAL-013)#Sanitization
 * @see https://ss64.com/nt/syntax-esc.html
 */

/**
 * @private
 * @param {string} str
 * @param {string} escChar
 * @return {Record<string,string>}
 */
const reducer = (str, escChar) => str.split('').reduce((curr, char) => {
  curr[char] = escChar
  return curr
}, {})

/**
 * escape map for win32
 * @type {Record<string,string>}
 */
export const MAP_WIN = reducer('()<>&*\'|=?;[]^~!."%@/\\:+,`\x0A\xFF', '^')
MAP_WIN['%'] = '%'
MAP_WIN['"'] = '\\'

/**
 * escape map for *nix
 * @type {Record<string,string>}
 */
export const MAP_NIX = reducer('{}()<>&*\'|=?;[]$-#~!."%/\\:+,`\x0A\xFF', '\\')

const PATH_MAP_WIN = { '\\': '^\\', ':': '^:' }
const PATH_MAP_NIX = { '/': '\\/' }

/**
 * @param {string} str
 * @param {object} [options]
 * @param {boolean} [options.filter]
 * @param {boolean} [options.isWin32]
 * @param {Record<string,string>} [options.map]
 * @param {Record<string,string>} [options.filterMap]
 * @returns {string}
 */
export const replace = (str = '', options) => {
  const {
    filter = false,
    isWin32 = (os.platform() === 'win32'),
    map,
    filterMap
  } = options || {}
  const _map = map || isWin32 ? MAP_WIN : MAP_NIX
  const _filterMap = filterMap || isWin32 ? PATH_MAP_WIN : PATH_MAP_NIX

  let newStr = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const esc = _map[char]
    if (esc) {
      if (filter) {
        newStr += (_filterMap[char] || ' ')
        continue
      }
      newStr += esc
    }
    newStr += char
  }
  return newStr
}

/**
 * Escapes a command or command arguments by operation system
 * ```js
 * import {escapeCommand} from 'esc-command'
 * const dirname = '/usr/bin;" cat /etc/passwd'
 * const esc = 'ls -1 "' + escapeCommand(dirname) + '"'
 * // ls -1 "\/usr\/bin\;\" cat \/etc\/passwd"
 * ```
 * @param {string} string
 * @returns {string} escaped string
 */
export const escapeCommand = string => replace(String(string ?? ''))

/**
 * Literal to escape a command or command arguments by operation system
 * ```js
 * import {escapeCommandLit} from 'esc-command'
 * const dirname = '/usr/bin;" cat /etc/passwd'
 * const esc = escapeCommandLit`ls -1 "${dirname}"`
 * // ls -1 "\/usr\/bin\;\" cat \/etc\/passwd"
 * ```
 * @returns {string} escaped string
 */
export const escapeCommandLit = (literals, ...vars) => literals
  .map((literal, i) => literal + escapeCommand(vars[i]))
  .join('')

/**
 * Filters a command or command arguments by operation system
 * ```js
 * import {filterCommand} from 'esc-command'
 * const dirname = '/usr/bin;" cat /etc/passwd'
 * const esc = 'ls -1 "' + filterCommand(dirname) + '"'
 * // ls -1 "\/usr\/bin   cat \/etc\/passwd"
 * ```
 * @param {string} string
 * @returns {string} filtered string
 */
export const filterCommand = string => replace(String(string ?? ''), { filter: true })

/**
 * Literal to filter a command or command arguments by operation system
 * ```js
 * import {filterCommandLit} from 'esc-command'
 * const dirname = '/usr/bin;" cat /etc/passwd'
 * const esc = filterCommandLit`ls -1 "${dirname}"`
 * // ls -1 "\/usr\/bin   cat \/etc\/passwd"
 * ```
 * @returns {string} filtered string
 */
export const filterCommandLit = (literals, ...vars) => literals
  .map((literal, i) => literal + filterCommand(vars[i]))
  .join('')
