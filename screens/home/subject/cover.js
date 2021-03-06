/*
 * @Author: czy0729
 * @Date: 2019-07-19 00:04:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-01-25 19:20:51
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Cover as CompCover } from '@screens/_'
import { getCoverMedium, getCoverLarge } from '@utils/app'
import { CDN_OSS_SUBJECT } from '@constants/cdn'
import { _ } from '@stores'

const imageWidth = 120

export default
@observer
class Cover extends React.Component {
  static contextTypes = {
    $: PropTypes.object
  }

  state = {
    onLoad: false
  }

  onLoad = () =>
    setTimeout(() => {
      this.setState({
        onLoad: true
      })
    }, 400)

  render() {
    const { $ } = this.context
    const { image, placeholder } = this.props
    const { onLoad } = this.state
    return (
      <View style={styles.container}>
        {!!image && (
          <CompCover
            src={CDN_OSS_SUBJECT(getCoverMedium(image))}
            size={imageWidth}
            height={160}
            radius
            border
            shadow
            placeholder={false}
            imageViewer
            imageViewerSrc={getCoverLarge(image || placeholder)}
            fadeDuration={0}
            event={{
              id: '条目.封面图查看',
              data: {
                subjectId: $.subjectId
              }
            }}
            noDefault
            onLoad={this.onLoad}
          />
        )}
        {!onLoad && (
          <CompCover
            style={styles.placeholder}
            src={CDN_OSS_SUBJECT(getCoverMedium(placeholder))}
            size={imageWidth}
            height={160}
            radius
            border
            noDefault
          />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    top: _.wind,
    left: _.wind
  },
  placeholder: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0
  }
})
