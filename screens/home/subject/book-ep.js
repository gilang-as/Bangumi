/*
 * @Author: czy0729
 * @Date: 2019-06-08 22:14:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-26 23:28:20
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { Flex, Touchable, Text, Input, Button, Iconfont } from '@components'
import { SectionTitle } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'

function BookEp({ style }, { $, navigation }) {
  const styles = memoStyles()
  const { chap, vol } = $.state
  const { book = {} } = $.subjectFormHTML
  const {
    status = {
      name: '未收藏'
    }
  } = $.collection
  return (
    <View style={[styles.container, _.container.wind, style]}>
      <SectionTitle
        right={
          <Touchable
            style={styles.iconPlay}
            onPress={() =>
              navigation.push('Comic', {
                cn: $.cn,
                jp: $.jp,
                subjectId: $.subjectId
              })
            }
          >
            <Iconfont name='xin-fan' size={16} />
          </Touchable>
        }
      >
        章节
      </SectionTitle>
      <Flex style={_.mt.md} align='start'>
        {status.name === '未收藏' ? (
          <Text type='sub'>收藏后开启管理进度</Text>
        ) : (
          <>
            <Flex.Item>
              <Flex>
                <Text style={styles.label} align='right'>
                  Chap.
                </Text>
                <View style={[styles.input, _.ml.sm]}>
                  <Input
                    keyboardType='numeric'
                    value={chap}
                    placeholder={book.chap || '0'}
                    onChangeText={text => {
                      const newText = text.replace(/[^\d]+/, '')
                      $.changeText('chap', newText)
                    }}
                  />
                </View>
                <Button
                  style={[styles.btnPlus, _.ml.sm]}
                  type='ghostPrimary'
                  onPress={() => $.doUpdateNext('chap')}
                >
                  +
                </Button>
              </Flex>
              <Flex style={_.mt.sm}>
                <Text style={styles.label} align='right'>
                  Vol.
                </Text>
                <View style={[styles.input, _.ml.sm]}>
                  <Input
                    keyboardType='numeric'
                    value={vol}
                    placeholder={book.vol || '0'}
                    onChangeText={text => {
                      const newText = text.replace(/[^\d]+/, '')
                      $.changeText('vol', newText)
                    }}
                  />
                </View>
                <Button
                  style={[styles.btnPlus, _.ml.sm]}
                  type='ghostPrimary'
                  onPress={() => $.doUpdateNext('vol')}
                >
                  +
                </Button>
              </Flex>
            </Flex.Item>
            <Button
              style={[styles.btn, _.ml.md]}
              type='ghostPrimary'
              onPress={$.doUpdateBookEp}
            >
              更新
            </Button>
          </>
        )}
      </Flex>
    </View>
  )
}

BookEp.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

export default observer(BookEp)

const memoStyles = _.memoStyles(_ => ({
  container: {
    height: 120,
    backgroundColor: _.colorPlain
  },
  label: {
    width: 40
  },
  input: {
    width: 80,
    height: 34
  },
  btn: {
    width: 80,
    height: 34
  },
  btnPlus: {
    width: 40,
    height: 34
  },
  iconPlay: {
    padding: _.sm,
    marginRight: -_.sm
  }
}))
