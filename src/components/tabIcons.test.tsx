import { describe, it, expect } from 'vitest'
import { tabIcons } from './tabIcons'

describe('tabIcons', () => {
  it('contains agents icon', () => {
    expect(tabIcons.agents).toBeDefined()
  })

  it('contains skills icon', () => {
    expect(tabIcons.skills).toBeDefined()
  })

  it('contains settings icon', () => {
    expect(tabIcons.settings).toBeDefined()
  })
})
