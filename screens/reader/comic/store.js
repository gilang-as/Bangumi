/* eslint-disable camelcase, no-undef, no-eval */
/*
 * @Author: czy0729
 * @Date: 2020-03-24 20:00:25
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-03-26 23:25:52
 */
import { observable, computed } from 'mobx'
import { open, safeObject, trim, getTimestamp, sleep } from '@utils'
import { info } from '@utils/ui'
import { fetchHTML, t } from '@utils/fetch'
import store from '@utils/store'
import { cheerio } from '@utils/html'
import { LIST_EMPTY } from '@constants'

const namespace = 'ScreenComic'

export default class ScreenComic extends store {
  state = observable({
    key: '',
    origins: LIST_EMPTY,
    eps: {},
    images: {},
    _loaded: false
  })

  init = async () => {
    t('漫画.初始化', {
      subjectId: this.subjectId
    })

    const { cn, jp } = this.params
    const state = await this.getStorage(undefined, this.namespace)
    this.setState({
      ...state,
      key: cn || jp,
      images: {}
    })

    // 中文
    const list1 = await this.searchOrigins(cn)
    if (list1.length) {
      this.setState({
        _loaded: true
      })
      return
    }
    await sleep(2000)

    // 去掉标点
    const list2 = await this.searchOrigins(
      cn.replace(/,|\.|!|\?|\(|\)|·|、|。|！|，|（|）/g, ' ')
    )
    if (list2.length) {
      this.setState({
        _loaded: true
      })
      return
    }
    await sleep(2000)

    // 日文
    if (jp !== cn) {
      const list3 = await this.searchOrigins(jp)
      if (list3.length) {
        this.setState({
          _loaded: true
        })
        return
      }
    }
    await sleep(2000)

    // 缩短关键字
    if (cn.length > 4) {
      const list4 = await this.searchOrigins(cn.slice(0, 3))
      if (list4.length) {
        this.setState({
          _loaded: true
        })
        return
      }
    }

    this.setState({
      key: cn || jp,
      _loaded: true
    })
    info('搜索完毕')
  }

  @computed get subjectId() {
    const { subjectId } = this.params
    return subjectId
  }

  @computed get namespace() {
    return `${namespace}|${this.subjectId}`
  }

  searchOrigins = async key => {
    const HTML = await fetchHTML({
      url: `https://so.177mh.net/m.php?k=${encodeURIComponent(key)}`
    })
    const $ = cheerio(HTML)
    const list =
      $('div.clist > ul > a')
        .map((index, element) => {
          const $li = cheerio(element)
          return safeObject({
            url: $li.attr('href'),
            cover: $li.find('img').attr('src'),
            title: $li.find('p.title').text(),
            sub: $li.find('p.subtitle').text(),
            extra: $li.find('p.uptime').text(),
            headers: {
              Referer: 'https://so.177mh.net/m.php'
            },
            type: 'warning',
            tag: '新新漫画'
          })
        })
        .get() || []

    if (list.length) {
      this.setState({
        key,
        origins: {
          list,
          _loaded: getTimestamp()
        }
      })
      this.setStorage(undefined, undefined, this.namespace)
      info('搜索完毕')
    }

    return list
  }

  searchEps = async url => {
    t('漫画.搜索章节', {
      subjectId: this.subjectId
    })

    const { eps } = this.state
    const HTML = await fetchHTML({
      url
    })
    const $ = cheerio(HTML)
    const list = (
      $('ul.chapter > li > a')
        .map((index, element) => {
          const $li = cheerio(element)
          return safeObject({
            url: `https://m.177mh.net/${$li.attr('href')}`,
            text: $li.text()
          })
        })
        .get() || []
    ).reverse()

    if (list.length) {
      this.setState({
        eps: {
          ...eps,
          [url]: {
            list,
            _loaded: getTimestamp()
          }
        }
      })
      this.setStorage(undefined, undefined, this.namespace)
    }

    return list
  }

  searchImages = async (url, title, index) => {
    t('漫画.搜索图片', {
      subjectId: this.subjectId,
      index
    })

    const { images } = this.state
    if (images[url]) {
      return images[url]
    }

    const HTML = await fetchHTML({
      url
    })
    const script = trim(cheerio(HTML, false)('section + script').text())

    function getImagesScript(script, title) {
      eval(script)
      return `title='${title}';images='${msg}'.split('|').map(it=>'https://picsh.77dm.top/h${img_s}/'+it)`
    }
    const urlScript = getImagesScript(script, title)
    const href = `https://tinygrail.mange.cn/app/index.html?script=${encodeURIComponent(
      urlScript
    )}`

    // 这个不缓存
    this.setState({
      images: {
        ...images,
        [url]: href
      }
    })
    return href
  }

  searchThenOpen = async (url, title, index) => {
    const href = await this.searchImages(url, title, index)
    open(href)
  }

  onChange = key => {
    this.setState({
      key
    })
  }

  onSearch = () => {
    t('漫画.搜索', {
      subjectId: this.subjectId
    })

    const { key } = this.state
    this.searchOrigins(key)
  }
}
