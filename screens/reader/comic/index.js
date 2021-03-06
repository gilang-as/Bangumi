/*
 * @Author: czy0729
 * @Date: 2020-03-24 19:59:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-26 23:29:57
 */
import React from 'react'
import { View, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import {
  Loading,
  Touchable,
  Flex,
  Image,
  Text,
  Expand,
  Mesume,
  Input,
  Button
} from '@components'
import { _ } from '@stores'
import { inject, withHeader, observer } from '@utils/decorators'
import Store from './store'

const title = ''
const imgWidth = 80
const imgHeight = 1.28 * imgWidth

export default
@inject(Store)
@withHeader({
  screen: title,
  hm: ['comic', 'Comic']
})
@observer
class Comic extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('cn')
  })

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  componentDidMount() {
    const { $ } = this.context
    $.init()
  }

  renderInfo(item) {
    const { $ } = this.context
    return (
      <Touchable onPress={() => $.searchEps(item.url)}>
        <Flex style={this.styles.info} align='start'>
          <Image
            src={item.cover}
            headers={item.headers}
            width={imgWidth}
            height={imgHeight}
            cache={false}
            shadow
            radius
          />
          <Flex.Item style={_.ml.md}>
            <Flex
              style={this.styles.content}
              direction='column'
              justify='between'
              align='start'
            >
              <View>
                <Text size={15} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={_.mt.sm} type='sub' size={13} numberOfLines={2}>
                  {item.sub}
                </Text>
              </View>
              <Text type='sub' size={12} numberOfLines={1}>
                {item.extra}
              </Text>
            </Flex>
          </Flex.Item>
        </Flex>
      </Touchable>
    )
  }

  renderEps(item) {
    const { $ } = this.context
    const { eps } = $.state
    const { list, _loaded } = eps[item.url]
    return (
      <Expand ratio={1.6}>
        <Flex style={this.styles.eps} wrap='wrap'>
          {!!_loaded && !list.length && <Text>没有搜索到章节</Text>}
          {list.map((i, index) => (
            <Touchable
              key={i.url}
              style={this.styles.ep}
              onPress={() =>
                $.searchThenOpen(i.url, `${i.text} - ${item.title}`, index)
              }
            >
              <Text size={13}>{i.text}</Text>
            </Touchable>
          ))}
        </Flex>
      </Expand>
    )
  }

  render() {
    const { $ } = this.context
    const { key, origins, eps, _loaded } = $.state
    if (!_loaded) {
      return (
        <View style={_.container.screen}>
          <Loading />
        </View>
      )
    }

    const { list } = origins
    return (
      <ScrollView style={_.container.screen}>
        <Flex style={this.styles.search}>
          <Flex.Item>
            <Input
              style={this.styles.ipt}
              value={key}
              returnKeyType='search'
              onChangeText={$.onChange}
              onSubmitEditing={$.onSearch}
            />
          </Flex.Item>
          <Button style={this.styles.btn} size='sm' onPress={$.onSearch}>
            搜索
          </Button>
        </Flex>
        {list.length ? (
          list.map((item, index) => (
            <View key={item.url} style={this.styles.item}>
              <View
                style={[this.styles.wrap, index !== 0 && this.styles.border]}
              >
                {this.renderInfo(item)}
                {!!eps[item.url] && this.renderEps(item)}
              </View>
            </View>
          ))
        ) : (
          <Flex style={this.styles.empty} direction='column' justify='center'>
            <Mesume />
            <Text style={[this.styles.footerText, _.mt.sm]}>搜索不到源头</Text>
          </Flex>
        )}
      </ScrollView>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  search: {
    padding: _.wind
  },
  ipt: {
    height: 34,
    paddingHorizontal: _.wind,
    fontSize: 12 + _.fontSizeAdjust,
    lineHeight: 14,
    backgroundColor: _.colorPlain,
    borderRadius: 34
  },
  btn: {
    width: 68,
    height: 34,
    marginLeft: _.sm,
    borderRadius: 34
  },
  item: {
    paddingLeft: _.wind,
    backgroundColor: _.colorPlain
  },
  wrap: {
    paddingVertical: _.wind,
    paddingRight: _.wind
  },
  border: {
    borderTopColor: _.colorBorder,
    borderTopWidth: _.hairlineWidth
  },
  info: {},
  content: {
    paddingVertical: 2,
    height: imgHeight
  },
  eps: {
    paddingTop: _.sm
  },
  ep: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 12,
    backgroundColor: _.select(_.colorBg, _._colorDarkModeLevel1),
    borderWidth: 1,
    borderColor: _.select(_.colorBorder, _._colorDarkModeLevel1),
    borderRadius: _.radiusXs
  },
  empty: {
    flex: 1,
    height: 480
  }
}))
