/*
 * @Author: czy0729
 * @Date: 2019-05-24 01:34:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-05-26 20:31:43
 */
import React from 'react'
import { ScrollView, AsyncStorage, Alert } from 'react-native'
import { CacheManager } from 'react-native-expo-image-cache'
import { Switch } from '@ant-design/react-native'
import { Popover, Menu, Text } from '@components'
import { systemStore, userStore } from '@stores'
import { open } from '@utils'
import { withHeader, observer } from '@utils/decorators'
import { info } from '@utils/ui'
import { IOS, GITHUB_URL } from '@constants'
import { MODEL_SETTING_QUALITY } from '@constants/model'
import _ from '@styles'
import Item from './item'

export default
@withHeader()
@observer
class Setting extends React.Component {
  static navigationOptions = {
    title: '设置'
  }

  setQuality = label => {
    if (label) {
      systemStore.setQuality(label)
    }
  }

  clearStorage = () => {
    Alert.alert('提示', '确定清除缓存? 包括图片缓存和页面接口的数据缓存', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: async () => {
          await AsyncStorage.clear()
          await CacheManager.clearCache()
          systemStore.setStorage('setting')
          userStore.setStorage('accessToken')
          userStore.setStorage('userInfo')
          userStore.setStorage('userCookie')
          info('已清除')
        }
      }
    ])
  }

  logout = () => {
    const { navigation } = this.props
    Alert.alert('提示', '确定退出登录?', [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '确定',
        onPress: async () => {
          await userStore.logout()
          navigation.popToTop()
        }
      }
    ])
  }

  render() {
    const { quality, cnFirst, autoFetch } = systemStore.setting

    const data = MODEL_SETTING_QUALITY.data.map(({ label }) => label)
    const popoverProps = IOS
      ? {
          overlay: <Menu data={data} onSelect={this.setQuality} />
        }
      : {
          data,
          onSelect: this.setQuality
        }
    return (
      <ScrollView style={_.container.screen}>
        <Item
          style={_.mt.md}
          hd='图片质量'
          ft={
            <Popover placement='bottom' {...popoverProps}>
              <Text size={16} type='sub'>
                {MODEL_SETTING_QUALITY.getLabel(quality)}
              </Text>
            </Popover>
          }
          arrow
          highlight
        />
        <Item
          border
          hd='优先使用中文'
          ft={<Switch checked={cnFirst} onChange={systemStore.switchCnFirst} />}
          withoutFeedback
        />
        <Item
          border
          hd='优化请求量(部分页面需手动刷新)'
          ft={
            <Switch
              checked={!autoFetch}
              onChange={systemStore.switchAutoFetch}
            />
          }
          withoutFeedback
        />

        <Item style={_.mt.md} hd='检测更新' ft='开发中' />
        <Item
          border
          hd='项目主页'
          arrow
          highlight
          onPress={() => open(GITHUB_URL)}
        />

        <Item
          style={_.mt.md}
          hd='清除缓存'
          arrow
          highlight
          onPress={this.clearStorage}
        />

        <Item
          style={_.mt.md}
          hd='退出登录'
          arrow
          highlight
          onPress={this.logout}
        />
      </ScrollView>
    )
  }
}