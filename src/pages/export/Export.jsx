import React, {Component} from 'react'
import {withRouter} from 'react-router';

import Mask from '../../compoments/mask/Mask'

import './export.scss'
import { search } from '../../api';
import DataPreview from '../../compoments/dataPreview/dataPreivew'
const content = (
    <div className="content">
        <h2>·标准字段包</h2>
        <p>省份、城市、公告标题、剑鱼标讯地址、公告类别、发布时间、采购单位、中标单位、中标金额、项目名称、公告内容</p>
        <h2>·高级字段包</h2>
        <p>省份、城市、公告标题、公告类别、公告内容、发布时间、公告地址、剑鱼标讯地址、项目名称、项目范围、预算金额、中标金额、开标日期、采购单位、采购单位信息(采购单位联系人、采购单位联系电话、招标代理机构)、中标单位信息(中标单位、中标单位联系人、中标单位联系电话)(来源:招标公告网站)、中标单位信息(中标单位联系人、中标单位联系电话、电子邮箱)(来源:国家企业公示网站)</p>
    </div>    
    )
class Export extends Component  {
    state = {
        option : 0,
        phone: '',
        phone_right: false,
        phone_check_show: false,
        email: '',
        email_right: false,
        email_check_show: false,
        code: '',
        code_right: false,
        cond_send: false,
        readingAgree:false,
        countdown:300,
        mask_show:false,
        show_preview:false,
        data_flow:[]
    }

    componentDidMount (){
        this.checkDataType()
        this.getInfo()
    }
    componentWillUnmount (){
        sessionStorage.setItem('from_order','true')

    }

    getInfo = async ()=>{
        const str = sessionStorage.getItem('sieve_info')
        const obj = JSON.parse(str)
        const res = await search(obj)
        if(res.status === '1'){
            if(res.data.info_flow_list.length){
                let data = res.data.info_flow_list
                const data_flow =  this.initData (data)
                this.setState({
                    data_flow,
                })
            }
        }
    }
    initData = (data) => {
        let dataArray = []
        for(const item of data){
            dataArray = dataArray.concat(item.data)
        }
        return dataArray
    }
    getUrlArg= () =>{
        const url = decodeURIComponent(window.location.href)
        const idx = url.indexOf('?')
        const params = url.substr(idx + 1)
        const arr = params.split('&')
        let res = {}
        arr.forEach((item,index) => {
            let pair = item.split('=')
            res[pair[0]] = pair[1]
        })
        return res
    }
    checkDataType  = () => {
        const params = this.getUrlArg()
        if(params.hasOwnProperty('dataType')&&params.dataType === '1'){
            this.setState({
                show_preview:true
            })
        }

    }
    dataPreview = () => {
        let nowUrl =decodeURIComponent(window.location.href)
        let url = `${nowUrl}?dataType=1`
        window.location.href=url;
    }

    
    checkOption = (type) => {
        const { option } = this.state
        if(type !== option)
            this.setState({
                option: type
            })
    }
    inputChange = (e,type) => {
        const val = e.target.value
        this.setState({
            [type]:val,
            [type + '_check_show']:false
        })
        const check = this.checkInput (val,type)
        if(check){
            this.setState({
                [type + '_right']:check,
                [type + '_check_show']:true
            })
        } else {
            this.setState({
                [type + '_right']:check,
            })
        }
    }

    inputBlur = (e,type) => {
        const val = e.target.value
        const check = this.checkInput (val,type)
        this.setState({
            [type + '_right']:check,
            [type + '_check_show']:true
        })
    }
    checkInput = (val,type) =>{
        if(type === 'phone'){
            const reg = /^[1-9]+[3-9]+[0-9]{9}/
            if(val.length !== 11)
                return false
            return reg.test(val)? true:false
        }
        else if(type === 'email'){
            const reg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
            return reg.test(val)? true:false
        }   
        else if(type === 'code'){
            const reg = /[a-zA-Z0-9]/
            if(val.length !== 6)
                return false
            return reg.test(val)? true:false
        }
    }
    checkAgree = () => {
        const {readingAgree} = this.state
        this.setState({
            readingAgree: !readingAgree
        })
    }

    tick = () => {
        const {countdown} = this.state
        this.setState({
            countdown: countdown -1
        })
    }
    sendCode = () => {
        const { code_send } = this.state
        if(!code_send){
            const timeDevice = setInterval(()=>{
                this.tick()
            },1000)
            this.setState({
                code_send:true
            })
            setTimeout(() => {
                clearInterval(timeDevice)
                this.setState({
                    code_send:false,
                    countdown: 300
                })
            }, 300000);
            }
    }

    toSieve = () => {
        // console.log(this.props);
        // this.props.history.push('/search')
        this.props.history.goBack()

    }
    showMask = () => {
        this.setState({
            mask_show:true
        })
    }
    closeMask = () =>{
        const { mask_show } = this.state
        if(mask_show){
            this.setState({
                mask_show:false
            })
        }
    }
    render () {
        const { option, phone_right, email_right, phone, email, phone_check_show, email_check_show, code_right, readingAgree, code_send, countdown,
                mask_show, show_preview, data_flow} = this.state
        return(
            <div className="export">
                {
                    show_preview?
                    <DataPreview data={data_flow}
                    />
                    :
                    <div className="order_pay">
                    <div className="main">
                        <div className="progress">
                            <div className="p_item p_item_active">
                                <div className="icon_item iconfont first"></div>
                                <span>条件筛选</span>
                                <div className="line line_active"></div>
                            </div>
                            <div className="p_item p_item_active">
                                <div className="icon_item iconfont second"></div>
                                <span>支付订单</span>
                                <div className="line"></div>
                            </div>
                            <div className="p_item">
                                <div className="icon_item iconfont third"></div>
                                <span>数据导出</span>
                            </div>
                        </div>
                        <div className="form">
                            <div className="form_item">
                                <div className="label_title">
                                    <span className="left">
                                    已为您筛选 <i className="strong">16764</i> 条数据
                                    </span>
                                    <span className="right" onClick= {this.toSieve}>返回筛选</span>
                                </div>
                                <div className="choose">
                                    <div className={"choose_item" + (option === 0 ? " choose_item_active":'' )}
                                         onClick = { () => this.checkOption(0) }
                                    >
                                        <span className="title">标准字段包</span>
                                        <span className="price"><del>1元/条</del> 0.5元/条</span>
                                        <div className="item iconfont"></div>
                                            
                                        
                                    </div>
                                    <div className={"choose_item" + (option === 1 ? " choose_item_active":'' )}
                                         onClick = { () => this.checkOption(1) }
                                    >
                                        <span className="title high iconfont">高级字段包</span>
                                        <span className="price"><del>2元/条</del> 1元/条</span>
                                        <div className="item iconfont"></div>
                                    </div>
                                </div>
                                <div className="tips">
                                    <span>标准字段包、高级字段包</span>
                                    <i className="iconfont" onClick={this.showMask}></i>
                                    <Mask  
                                        title="字段包说明"
                                        content={content}
                                        toConfirm={this.closeMask}
                                        show={mask_show}
                                    />
                                </div>
                            </div>
                            <div className="form_item phone_number">
                                <div className="form_control">
                                    <div className="input">
                                        <input type="text" 
                                               className="phone_input"
                                               placeholder="手机号"
                                               maxLength="11"
                                               onChange={(e) => this.inputChange(e,'phone')}
                                               onBlur={(e) =>this.inputBlur(e,'phone')}
                                        />
                                        {
                                            phone&&phone_check_show?
                                            <div className="devinput">
                                            {
                                                phone_right?
                                                <i className="iconfont"></i>
                                                :
                                                <span className="wrong">手机号不正确</span>
                                            }
                                            </div>
                                            :''
                                        }
                                    </div>
                                </div>
                            </div>
                            <p className="msg">*数据导出将发送至邮箱</p>
                            <div className="form_item" id="verify">
                                <div className="form_control">
                                    <div className="input">
                                        <input type="text" 
                                               className="email_input"
                                               placeholder="邮箱"
                                               maxLength="20"
                                               onChange={(e) => this.inputChange(e,'email')}
                                               onBlur={(e) =>this.inputBlur(e,'email')}
                                        />
                                        {
                                            email && email_check_show?
                                            <div className="devinput">
                                            {
                                                email_right && code_right?
                                                <i className="iconfont"></i>
                                                :
                                                <span>
                                                    {
                                                        email_right?
                                                        '':
                                                        <span className="wrong">邮箱不正确</span> 
                                                       }
                                                </span>
                                            }
                                            </div>
                                            :''
                                        }
                                    </div>
                                </div>
                                <div className={"form_control code" + (email_right? ' code_active':'')}>
                                    <div className="input">
                                            <input type="text" 
                                               className="code_input"
                                               placeholder="验证码"
                                               maxLength="6"
                                               onChange={(e) => this.inputChange(e,'code')}
                                            />
                                            <div className="devinput">
                                                <span className="send_code" onClick={this.sendCode}>{code_send? countdown+'s':'发送验证码'}</span>
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form_item">
                                <div className="way">
                                    <span className="payment">支付方式</span>
                                    <div className="way_right">
                                        <span className="payment">微信支付</span>
                                        <i></i>
                                    </div>
                                </div>
                            </div>
                            <p className="msg">
                                购买须知：最低起售
                                <span>100</span>
                                元；标准字段包:原价
                                <span>1</span>
                                元/条、
                                <span>5</span>
                                折价
                                <span>0.5</span>
                                元/条计费；高级字段包:原价
                                <span>2</span>
                                元/条、
                                <span>5 </span> 
                                折价
                                <span>1</span>
                                元/条计费；
                            </p>
                        </div>
                    </div>
                    <div className="fixed_bottom_box">
                        <div className="radio_form">
                            <div className={"left" + (readingAgree? " radio_active iconfont":"")} onClick = {this.checkAgree}></div>
                            <div className="right">
                                <span>我已阅读，理解并接受</span>
                                <span className="service">《剑鱼标讯线上购买与服务条款》</span>
                            </div>
                        </div>
                        <div className="price">
                            <del>￥16769</del>
                            <span>￥8384.5</span>
                        </div>
                        <div className="form_btn">
                            <div className="btn preview" onClick={this.dataPreview}>预览数据</div>
                            <div className="btn confirm">确认支付</div>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default withRouter(Export)