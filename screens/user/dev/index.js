/*
 * @Author: czy0729
 * @Date: 2020-01-13 11:23:53
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-21 17:31:39
 */
import React from 'react'
import { ScrollView, Platform } from 'react-native'
import Constants from 'expo-constants'
import { Text, Switch, Touchable } from '@components'
import { ItemSetting } from '@screens/_'
import { _, systemStore } from '@stores'
import { withHeader, observer } from '@utils/decorators'

const title = '开发菜单'

export default
@withHeader({
  screen: title,
  hm: ['dev', 'DEV']
})
@observer
class DEV extends React.Component {
  static navigationOptions = {
    title
  }

  render() {
    const { dev } = systemStore.state
    return (
      <ScrollView
        style={this.styles.screen}
        contentContainerStyle={this.styles.container}
      >
        <ItemSetting
          hd='调试'
          ft={<Switch checked={dev} onChange={systemStore.toggleDev} />}
          withoutFeedback
        />
        <ItemSetting
          hd='JSException'
          ft={
            // eslint-disable-next-line no-undef
            <Touchable onPress={() => yijianmaojiao()}>
              <Text>一键猫叫</Text>
            </Touchable>
          }
          withoutFeedback
        />
        <Text
          style={[this.styles.code, _.mt.md]}
          size={12}
          lineHeight={16}
          type='sub'
        >
          {JSON.stringify(Platform)}
        </Text>
        <Text
          style={[this.styles.code, _.mt.md]}
          size={12}
          lineHeight={16}
          type='sub'
        >
          {JSON.stringify(Constants)}
        </Text>
      </ScrollView>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  screen: {
    backgroundColor: _.colorBg
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: _.lg,
    paddingHorizontal: _.wind
  },
  code: {
    padding: _.wind,
    backgroundColor: _.select(_.colorBg, _._colorDarkModeLevel1),
    borderWidth: 1,
    borderColor: _.colorBorder,
    borderRadius: _.radiusXs,
    overflow: 'hidden'
  }
}))
