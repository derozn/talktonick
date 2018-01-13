import React, { Component } from 'react'

import InView from 'client/components/Common/InView'

import PropTypes from 'prop-types'

import { getImage } from 'client/utils/imageUtils'

import glamorous from 'glamorous'

import Fade from 'client/components/Transitions/Fade'

const ImageContainer = glamorous.div(() => ({
  position: 'relative'
}))

const Image = glamorous.img({
  position: 'relative',
  width: '100%',
  verticalAlign: 'top'
})

const BgImage = glamorous.div(({ bgSize, bgPos, bgRepeat, bgImage }) => ({
  position: 'relative',
  width: '100%',
  backgroundPosition: bgPos,
  backgroundSize: bgSize,
  backgroundRepeat: bgRepeat,
  backgroundImage: `url('${bgImage}')`
}))

class LazyImage extends Component {
  static PropTypes = {
    src: PropTypes.string,
    useBgImage: PropTypes.bool,
    alt: PropTypes.string,
    bgPos: PropTypes.string,
    bgSize: PropTypes.string,
    bgRepeat: PropTypes.string
  }

  static defaultProps = {
    useBgImage: false,
    bgPos: 'center',
    bgSize: 'cover',
    bgRepeat: 'no-repeat'
  }

  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      error: false,
      isLoading: false,
      isVisible: null
    }

    this.imagePromise = null
  }

  componentWillUnmount () {
    this.cancelFetchIfFetching()
  }

  cancelFetchIfFetching () {
    if (this.imagePromise && this.imagePromise.cancel) {
      this.imagePromise.cancel()
      this.imagePromise = null
    }
  }

  handleImageLoad = () => {
    this.setState({
      loaded: true,
      isLoading: false,
      error: false
    })
  }

  handleImageError = () => {
    this.setState({
      loaded: false,
      error: true,
      isLoading: false
    })
  }

  fetchImage (src = this.props.src) {
    const { loaded, isLoading } = this.state

    if (!src || loaded || isLoading) {
      return false
    }

    this.imagePromise = getImage(src)
    .then(this.handleImageLoad)
    .catch(this.handleImageError)
  }

  shouldComponentUpdate (nextProps, { loaded }) {
    return loaded
  }

  componentWillReceiveProps ({ src }, { isVisible }) {
    if (src !== this.props.src && isVisible) {
      this.fetchImage(src)
    }
  }

  handleVisibility = (isVisible) => {
    this.setState({ isVisible })
    isVisible && this.fetchImage()
  }

  renderImage () {
    const {
      useBgImage,
      children,
      src,
      alt,
      bgPos,
      bgSize,
      bgRepeat,
      ...rest
    } = this.props

    const {
      loaded
    } = this.state

    return (
      <ImageContainer>
        <Fade isActive={loaded}>
          {
            useBgImage
            ? (
              <BgImage bgImage={src} bgPos={bgPos} bgSize={bgSize} bgRepeat={bgRepeat} {...rest}>
                { children }
              </BgImage>
            )
            : (
              <Image src={src} alt={alt} {...rest}>
                { children }
              </Image>
            )
          }
        </Fade>
      </ImageContainer>
    )
  }

  render () {
    return (
      <InView onChange={this.handleVisibility}>
        { this.renderImage() }
      </InView>
    )
  }
}

export default LazyImage
