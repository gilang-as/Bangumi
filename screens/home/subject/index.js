/*
 * @Author: czy0729
 * @Date: 2019-03-23 04:16:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-18 23:26:14
 */
import React from 'react'
import { InteractionManager, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { BlurView, ListView } from '@components'
import { ManageModal, ItemComment } from '@screens/_'
import { _ } from '@stores'
import { open, copy } from '@utils'
import { inject, withTransitionHeader } from '@utils/decorators'
import { keyExtractor, getCoverMedium } from '@utils/app'
import { hm, t } from '@utils/fetch'
import { info } from '@utils/ui'
import { HOST, IOS } from '@constants'
import { CDN_OSS_SUBJECT } from '@constants/cdn'
import Header from './header'
import Store from './store'

const title = '条目'
const refreshControlProps = {
  tintColor: _.__colorPlain__,
  titleColor: _.__colorPlain__
}
const showBlurViewOffset = 200

export default
@inject(Store)
@withTransitionHeader({
  screen: title,
  colorStart: _.colorPlainRaw
})
@observer
class Subject extends React.Component {
  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  state = {
    showBlurView: true,
    rendered: false
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(async () => {
      setTimeout(() => {
        this.rendered()
      }, 300)

      const { $, navigation } = this.context
      withTransitionHeader.setTitle(navigation, $.cn)

      // 右上角头部按钮
      const data = await $.init()
      if (data) {
        const url = String(data.url).replace('http://', 'https://')
        navigation.setParams({
          headerTransitionTitle: $.cn,
          popover: {
            data: ['Bangumi', '复制链接'],
            onSelect: key => {
              t('条目.右上角菜单', {
                subjectId: $.subjectId,
                key
              })
              switch (key) {
                case '复制链接':
                  copy(`${HOST}/subject/${$.params.subjectId}`)
                  info('已复制')
                  break
                default:
                  open(url)
                  break
              }
            }
          }
        })
      }

      hm(`subject/${$.params.subjectId}`, 'Subject')
    })
  }

  onScroll = e => {
    const { onScroll } = this.props
    onScroll(e)

    this.rendered()

    const { nativeEvent } = e
    const { y } = nativeEvent.contentOffset
    if (this.state.showBlurView && y > showBlurViewOffset) {
      this.setState({
        showBlurView: false
      })
      return
    }

    if (!this.state.showBlurView && y <= showBlurViewOffset) {
      this.setState({
        showBlurView: true
      })
    }
  }

  rendered = () => {
    if (!this.state.rendered) {
      this.setState({
        rendered: true
      })
    }
  }

  renderItem = ({ item, index }) => {
    const { rendered } = this.state
    if (!rendered) {
      return null
    }

    const { $, navigation } = this.context
    const event = {
      id: '条目.跳转',
      data: {
        from: '吐槽',
        subjectId: $.subjectId
      }
    }
    return (
      <ItemComment
        navigation={navigation}
        event={event}
        index={index}
        time={item.time}
        avatar={item.avatar}
        userId={item.userId}
        userName={item.userName}
        star={$.hideScore ? undefined : item.star}
        comment={item.comment}
      />
    )
  }

  render() {
    const { $ } = this.context
    const { visible } = $.state
    const { name_cn: nameCn, name, images = {} } = $.subject
    const { showBlurView, rendered } = this.state
    return (
      <View style={_.select(_.container.screen, _.container.content)}>
        {showBlurView && (
          <BlurView
            style={styles.blurView}
            theme='dark'
            tint={_.select('default', 'dark')}
            src={CDN_OSS_SUBJECT(
              getCoverMedium($.coverPlaceholder || images.common)
            )}
          />
        )}
        <ListView
          style={_.container.flex}
          contentContainerStyle={styles.contentContainerStyle}
          keyExtractor={keyExtractor}
          data={$.subjectComments}
          scrollEventThrottle={16}
          refreshControlProps={refreshControlProps}
          ListHeaderComponent={<Header rendered={rendered} />}
          renderItem={this.renderItem}
          onScroll={this.onScroll}
          onHeaderRefresh={$.init}
          onFooterRefresh={$.fetchSubjectComments}
        />
        <ManageModal
          visible={visible}
          subjectId={$.params.subjectId}
          title={nameCn || name}
          desc={name}
          action={$.action}
          onSubmit={$.doUpdateCollection}
          onClose={$.closeManageModal}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0,
    height: IOS ? _.window.height * 0.32 : 160 // iOS有弹簧, 所以拉下来太矮会看见背景
  },
  listView: {
    ..._.container.flex
  },
  contentContainerStyle: {
    paddingTop: _.headerHeight,
    paddingBottom: _.space
  }
})
