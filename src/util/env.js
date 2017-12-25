const ua = navigator.userAgent.toLowerCase()

export const isWeChatDevTools = /wechatdevtools/.test(ua)
export const isAndroid = (ua && ua.indexOf('android') > 0)
