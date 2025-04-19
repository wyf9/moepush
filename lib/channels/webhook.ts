import { BaseChannel, ChannelConfig, SendMessageOptions } from './base'
import { fetchWithTimeout } from '@/lib/utils'

interface WebhookMessage {
  url: string,
  method: string,
  headers: string,
  body: string,
  timeout: number,
  ignore_http_code: boolean
}

// method 选项
const methodOptions = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' }
]

// 默认值 / 提示
const defaultHeaders = `{}`
const placeholderHeaders = `{
  "User-Agent": "curl/7.88.1",
  "Accept": "*/*"
}
`
const defaultBody = `{}`
const placeholderBody = `{
    "content": "Test Message"
}
`

export class WebhookChannel extends BaseChannel {
  readonly config: ChannelConfig = {
    type: 'webhook',
    label: '自定义 Webhook',
    templates: [
      {
        type: 'webhook',
        name: 'Webhook',
        description: '发送 Webhook (HTTP) 请求',
        fields: [
          { key: 'url', description: 'Webhook URL (留空使用渠道默认值)', component: 'input', placeholder: 'https://api.example.com/send/xxx' },
          { key: 'method', description: '请求类型 (Method)', component: 'select', options: methodOptions, required: true },
          { key: 'headers', description: '请求头 (Headers)', component: 'textarea', placeholder: placeholderHeaders, defaultValue: defaultHeaders, required: true },
          { key: 'body', description: '请求体 (Body, 为 GET 请求时无需填写)', component: 'textarea', placeholder: placeholderBody, defaultValue: defaultBody, required: true },
          { key: 'timeout', description: '请求超时时间 (秒)', component: 'input', placeholder: '30', defaultValue: '30' },
          { key: 'ignore_http_code', description: '是否忽略 HTTP 返回代码 (始终视为请求成功)', component: 'checkbox' }
        ]
      }
    ]
  }

  async sendMessage(
    message: WebhookMessage,
    options: SendMessageOptions
  ): Promise<Response> {
    const { webhook } = options

    var requestUrl
    if (message.url) {
      // 优先使用覆盖
      requestUrl = message.url
    } else if (webhook) {
      // 没有则使用默认 Webhook 地址
      requestUrl = webhook
    } else {
      // 还没有就抛出错误
      throw new Error('缺少自定义 Webhook 地址')
    }

    console.log('sendWebhookMessage message:', message)

    try {
      var requestHeaders = JSON.parse(message.headers)
    } catch (error) {
      throw new Error(`自定义 Webhook Headers 解析错误: ${error}`)
    }

    var requestOptions = {
      method: message.method,
      headers: requestHeaders,
      body: message.body || null,
      timeout: message.timeout,
    }

    const response = await fetchWithTimeout(requestUrl, requestOptions)

    if (!message.ignore_http_code && !response.ok) {
      const text = await response.text()
      throw new Error(`自定义 Webhook 消息推送失败: ${text}`)
    }

    return response
  }
} 