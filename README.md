# esc-command

Utility methods to prevent command injection vulnerabilities.

# usage

## escapeCommand()

Escapes a command or command arguments by operation system

```js
import {escapeCommand} from 'esc-command'
const dirname = '/usr/bin;" cat /etc/passwd'
const esc = 'ls -1 "' + escapeCommand(dirname) + '"'
// ls -1 "\/usr\/bin\;\" cat \/etc\/passwd"
```

## escapeCommandLit``

Literal to escape a command or command arguments by operation system

```js
import {escapeCommandLit} from 'esc-command'
const dirname = '/usr/bin;" cat /etc/passwd'
const esc = escapeCommandLit`ls -1 "${dirname}"`
// ls -1 "\/usr\/bin\;\" cat \/etc\/passwd"
```

## filterCommand()

Filters a command or command arguments by operation system

```js
import {filterCommand} from 'esc-command'
const dirname = '/usr/bin;" cat /etc/passwd'
const esc = 'ls -1 "' + filterCommand(dirname) + '"'
// ls -1 "\/usr\/bin   cat \/etc\/passwd"
```

## filterCommandLit``

Literal to filter a command or command arguments by operation system

```js
import {filterCommandLit} from 'esc-command'
const dirname = '/usr/bin;" cat /etc/passwd'
const esc = filterCommandLit`ls -1 "${dirname}"`
// ls -1 "\/usr\/bin   cat \/etc\/passwd"
```

## License

[MIT](./LICENSE)

## References

- [Testing for Command Injection][]
- [Escape Characters, Delimiters and Quotes at the Windows command line][]
 
[Testing for Command Injection]: https://wiki.owasp.org/index.php/Testing_for_Command_Injection_(OTG-INPVAL-013)#Sanitization
[Escape Characters, Delimiters and Quotes at the Windows command line]: https://ss64.com/nt/syntax-esc.html
