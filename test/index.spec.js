import os from 'node:os'
import assert from 'node:assert'
import {
  replace,
  escapeCommand,
  escapeCommandLit,
  filterCommand,
  filterCommandLit
} from '../src/index.js'
import { describeBool } from './describeBool.js'

const str = "\n !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\xff"

// const log = console.log
const log = () => null

const isNix = os.platform() !== 'win32'

describe('string/escapeCommand', function () {
  describe('replace', function () {
    it('shall escape string (*nix)', function () {
      const result = replace(str)
      log('%j', result)
      assert.equal(
        result,
        "\\\n \\!\\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\-\\.\\/\\:\\;\\<\\=\\>\\?@\\[\\\\\\]^_\\`\\{\\|\\}\\~\\ÿ"
      )
    })

    it('shall escape string (win)', function () {
      const result = replace(str, { isWin32: true })
      log('%j', result)
      assert.equal(
        result,
        "^\n ^!\\\"#$%%^&^'^(^)^*^+^,-^.^/^:^;^<^=^>^?^@^[^\\^]^^_^`{^|}^~^ÿ"
      )
    })

    it('shall filter string (*nix)', function () {
      const result = replace(str, { filter: true })
      log('%j', result)
      assert.equal(result, '                \\/      @   ^_      ')
    })

    it('shall filter pathname (*nix)', function () {
      const str = '/usr/bin"; cat /etc/passwd'
      const result = replace(str, { filter: true })
      log('%j', result)
      assert.equal(result, '\\/usr\\/bin   cat \\/etc\\/passwd')
    })

    it('shall filter string (win)', function () {
      const result = replace(str, { filter: true, isWin32: true })
      log('%j', result)
      assert.equal(result, '    #$        -  ^:       ^\\  _ { }  ')
    })

    it('shall filter pathname (win)', function () {
      const str = 'C:\\httpd\\public\\doc\\"Doc=Doc1.pdf+|+Dir c:\\'
      const result = replace(str, { filter: true, isWin32: true })
      log('%j', result)
      assert.equal(
        result,
        'C^:^\\httpd^\\public^\\doc^\\ Doc Doc1 pdf   Dir c^:^\\'
      )
    })
  })

  describeBool(isNix)('*nix', function () {
    it('shall escape linux command', function () {
      assert.equal(replace('git log | cat'), 'git log \\| cat')
    })

    it('escapeCommand', function () {
      assert.equal(escapeCommand('git log | cat'), 'git log \\| cat')
    })

    it('escapeCommandLit', function () {
      const dirname = '/usr/bin"; cat /etc/passwd'
      assert.equal(
        escapeCommandLit`ls -1 ${dirname}`,
        'ls -1 \\/usr\\/bin\\"\\; cat \\/etc\\/passwd'
      )
    })

    it('filterCommand', function () {
      assert.equal(filterCommand('git log | cat'), 'git log   cat')
    })

    it('filterCommandLit', function () {
      const dirname = '/usr/bin"; cat /etc/passwd'
      assert.equal(
        filterCommandLit`ls -1 "${dirname}"`,
        'ls -1 "\\/usr\\/bin   cat \\/etc\\/passwd"'
      )
    })
  })
})
