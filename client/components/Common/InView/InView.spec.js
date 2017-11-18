import React from 'react'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import InView from './Inview'

const DummyComponent = () => <div />

jest.mock('client/utils/domUtils', () => ({
  isElemInView: () => true,
  testForPassiveScroll: () => false
}))

describe('components/Common/InView', () => {
  let initialProps

  beforeEach(() => {
    initialProps = {
      onVisible: jest.fn(),
      onHidden: jest.fn()
    }
  })

  describe('@renders', () => {
    it('in default state', () => {
      const component = shallow(<InView { ...initialProps } />)

      expect(toJson(component)).toMatchSnapshot()
      component.unmount()
    })

    it('with react node children', () => {
      const component = shallow(<InView { ...initialProps }><DummyComponent /></InView>)

      expect(toJson(component)).toMatchSnapshot()
      component.unmount()
    })

    it('with react element children', () => {
      const component = shallow(<InView { ...initialProps }><div /></InView>)

      expect(toJson(component)).toMatchSnapshot()
      component.unmount()
    })
  })
})
