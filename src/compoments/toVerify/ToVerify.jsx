import React, {Component}from 'react';
import './toVerify.scss'
class ToVerify extends Component{
    componentDidMount () {
        this.verify()
    }
    verify = () => {
        var nc_token = ["FFFF0N0N000000008AB8", (new Date()).getTime(), Math.random()].join(':');
        const that = this
        var NC_Opt =
        {
            renderTo: "#ali_verify",
            appkey: "FFFF0N0N000000008AB8",
            scene: "nc_other",
            token: nc_token,
            customWidth: 300,
            trans: { "key1": "code0" },
            elementID: ["usernameID"],
            is_Opt: 0,
            language: "cn",
            isEnabled: true,
            timeout: 3000,
            times: 5,
            apimap: {
            // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
            // 'get_captcha': '//b.com/get_captcha/ver3',
            // 'get_captcha': '//pin3.aliyun.com/get_captcha/ver3'
            // 'get_img': '//c.com/get_img',
            // 'checkcode': '//d.com/captcha/checkcode.jsonp',
            // 'umid_Url': '//e.com/security/umscript/3.2.1/um.js',
            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
            // 'umid_serUrl': 'https://g.com/service/um.json'
            },
            callback: function (data) {
                const obj = {
                    token: nc_token,
                    sig: data.sig,
                    session_id: data.csessionid
                }
                that.props.verifySuccess && that.props.verifySuccess(obj)
            }
        }
        if (window.noCaptcha) {
            var nc = new window.noCaptcha(NC_Opt)
            nc.upLang('cn', {
                _startTEXT: "请按住滑块，拖动到最右边",
                _yesTEXT: "验证通过",
                _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
                _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
            })
        }
    }
    cancel = () => {
        this.props.cancel && this.props.cancel()
    }
    render () {
        return (
            <div onClick={(e)=>e.stopPropagation()} className='verify_win_container'>
                <div className='verify_win_title'>
                    人机验证
                </div>
                <div className='verify_win_ipt_ctn'>
                    <div className='verify_win_text'>
                        系统检测到您请求过于频繁，请验证您的操作
                    </div>
                    <div id='ali_verify' className="nc-container">

                    </div>
                    <div className='verify_btn_container'>
                        <div
                            onClick={this.cancel}
                            className='verify_button'>
                            取消
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ToVerify