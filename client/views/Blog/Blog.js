import React, { Component } from 'react'
import { connect } from 'react-redux'
import Wrapper from 'client/components/Gui/Wrapper'

@connect(null, null)
export default class Blog extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Wrapper className='blog'>
        blog
      </Wrapper>
    )
  }
}
