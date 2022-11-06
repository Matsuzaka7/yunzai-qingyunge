import plugin from '../../lib/plugins/plugin.js'
import { segment } from 'oicq'
import fetch from 'node-fetch'

// 青云阁 api
const URL = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=`;
export class qingyunge_message extends plugin {
  constructor () {
    super({
      name: '砂糖聊天',
      dsc: '艾特我即可与我聊天啦',
      event: 'message.group', // 监听群消息回复
      priority: 5000,
    })
  }
  
  /** 接受到消息都会执行一次 */
  async accept () {
  	if (this.e.message[0].type === 'at' && this.e.message[0].qq == this.e.self_id) {
      // 当艾特了，但没有说话时 回复这个
  		if (this.e.message.length === 1 || (this.e.message[1] && this.e.message[1].text == '')) {
  			await this.reply([segment.at(this.e.user_id), ' 哎呀 你干嘛~', segment.image(this.getImg())])
				return
  		}
  		// 艾特后面的内容有值，就执行回复方法
  		if (this.e.message[1] && this.e.message[1].type === 'text') {
	  			const url = encodeURI(URL + this.e.message[1].text);
					let result = await fetch(url).catch((err) => logger.error(err))

					//判断接口是否请求成功
			    if (!result) {
			      logger.error('意外错误')
			      return await this.reply('出现意外错误')
			    }

			    // 接口结果，json字符串转对象
			    result = await result.json()

          // 菲菲是 青云阁机器人名字，可替换为自己机器人名。
			    const reg = new RegExp( '菲菲', "g" );
					result = result.content.replace( reg, '砂糖' ).trim();

			    // 输入日志
			    logger.info(`青云阁聊天返回：${result.content}`)

					// 回复消息
			    await this.reply([
			      segment.at(this.e.user_id), // 艾特艾特我的人
			      ` ${result}` // 回复消息
			    ])
		  	}
  		}
  }
  // 获取随机表情包
	getImg = () => {
		// 当指令后没有跟数据，随机返回此数组里面的一句话
		const imgArray = [ "https://c2cpicdw.qpic.cn/offpic_new/1678800780//1678800780-2229448361-C4D4506256984E0951AE70EF2D39C7AF/0?term=2",
			"https://c2cpicdw.qpic.cn/offpic_new/1678800780//1678800780-4170714532-4E83609698BC1753845AA0BE8D66051D/0?term=2",
			"https://c2cpicdw.qpic.cn/offpic_new/1678800780//1678800780-3888586142-E9BD0789F60B2045ECBA19E36DD25EC7/0?term=2",
			"https://c2cpicdw.qpic.cn/offpic_new/1678800780//1678800780-2518379710-D757D5240D4B157D098B1719921969A1/0?term=2"
		];
		return imgArray[Math.round( Math.random() * imgArray.length - 1 )];
	}
}

 
