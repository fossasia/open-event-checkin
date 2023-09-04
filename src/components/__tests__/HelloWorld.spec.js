import { describe, expect, it } from 'vitest'

import HelloWorld from '@/HelloWorld.vue'
import { mount } from '@vue/test-utils'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
