import React, {Component} from 'react'
import {withRouter} from 'react-router';
import { DatePicker,List} from 'antd-mobile';
// import zhCN from 'antd-mobile/lib/date-picker/locale/zh_CN';

import {getTime} from '../../common/index'

import 'antd-mobile/lib/date-picker/style/css';
import './sieve.scss'
const pcSequenece = require('../../common/pcSequence.json')
const industry = {
        交通工程: ["道路", "轨道", "桥梁", "隧道", "其他"],
        信息技术: ["系统集成及安全", "软件开发", "运维服务", "其他"],
        农林牧渔: ["生产物资", "生产设备", "相关服务"],
        医疗卫生: ["设备", "耗材", "药品"],
        市政设施: ["道路", "绿化", "线路管网", "综合项目"],
        建筑工程: ["材料设备", "工程施工", "勘察设计", "监理咨询", "机电安装"],
        弱电安防: ["综合布线", "智能系统", "智能家居"],
        服务采购: [
          "仓储物流",
          "广告宣传印刷",
          "物业",
          "其他",
          "法律咨询",
          "会计",
          "审计",
          "安保",
        ],
        机械设备: [
          "工程机械",
          "车辆",
          "其他机械设备",
          "机床相关",
          "机械零部件",
          "矿山机械",
        ],
        水利水电: ["水利工程", "发电工程", "航运工程", "其他工程"],
        能源化工: ["仪器仪表", "原材料", "新能源", "设备物资", "化工产品"],
        行政办公: [
          "专业设备",
          "办公用品",
          "生活用品",
          "通用办公设备",
          "办公家具",
        ],
      }

const sortArray = [
        "建筑工程",
        "行政办公",
        "医疗卫生",
        "服务采购",
        "机械设备",
        "水利水电",
        "能源化工",
        "弱电安防",
        "信息技术",
        "交通工程",
        "市政设施",
        "农林牧渔",
      ]

const timeArray = ['不限','最近一周','最近一月','最近一年']

const type = {
    拟建项目:[],
    招标预告:[],
    招标公告:["招标","邀标","询价","竞谈","单一","竞价","变更","其他"],
    招标结果:["中标","成交","废标","流标"],
    招标信用信息:["合同","验收","违规"] 
}
const type_props = Object.keys(type)
const default_type_item_checked = {
    拟建项目:[],
    招标预告:[],
    招标公告:[],
    招标结果:[],
    招标信用信息:[] 
}

class Sieve extends Component {
    state = {
        dp_show:false,  //datePicker
        tip_show:false,
        options : ['行业','金额','时间','地区','类型'],
    }

    componentDidMount (){
        const {has_option} = this.props
        if(has_option && has_option.length)
            this.setState({
                options : has_option
            })
    }

    initCheck = () => {
    }
    deepClone = (obj) => {
        if(typeof obj === 'object'){
            let res = Array.isArray(obj)? []:{}
            for(const key in obj){
                res[key] = this.deepClone(obj[key])
            }
            return res
        } else {
           return obj
        }
    }
    checkBtn = (stateName,val) =>{
        const key = this.props.sieveState[stateName]
        if(stateName !== 'option'&& stateName !=='money_checked'){
            if(val === key){
                if(typeof val === 'number'){
                  val = 0
                } else if(typeof val ==='string'){
                    val = ''
                } else if(typeof val ==='boolean'){
                    val = false
                } else if(typeof val ==='object'){
                    val = null
                }
            }
        }
        if(stateName ==='time_checked'){
            this.checkDate(val)
        }
        if(stateName ==='money_checked'){
            this.checkMoney(val)
        }
        this.setSieveState({
            [stateName]:val
        })
        
    }

    checkMoney = (type) => {
        if(type === ''){
           this.setSieveState({
                min_money:'',
                max_money:''
            })
        }
        
    }
    moneyChange = (type,e) => {
        const value = e.target.value
        this.setSieveState({
                [type]:value,
            })
    }


    checkArea = (item) => {
        if(item ==='all'){
            this.setSieveState({
                area_checked:[]
            })
            return
        }
        const {area_checked} = this.props.sieveState
        const idx = area_checked.indexOf(item)
        if(idx >= 0){
            area_checked.splice(idx,1)
        } else {
            area_checked.push(item)
        }
        this.setSieveState({
            area_checked
        })
    }

    checkType = (item) => {
        if(item ==='all'){
            this.setSieveState({
                type_checked:[],
                type_item_checked: this.deepClone(default_type_item_checked)
            })
            return
        }
        const {type_checked,type_item_checked} = this.props.sieveState
        const idx = type_checked.indexOf(item)
        if(idx >= 0){
            type_checked.splice(idx,1)
            type_item_checked[item] = []
        } else {
            type_checked.push(item)
            type_item_checked[item] = [...type[item]]
          
        }
        this.setSieveState({
            type_checked,
            type_item_checked
        })
    }

    checkTypeItem = (item,item1) => {
        const {type_item_checked,type_checked} = this.props.sieveState
        const idx = type_item_checked[item].indexOf(item1)
        if(idx >=0 ){
            type_item_checked[item].splice(idx,1)
        } else {
            type_item_checked[item].push(item1)
        }
        if(type_item_checked[item].length === type[item].length){
            type_checked.push(item)
        } else {
            const idx1 = type_checked.indexOf(item)
            if(idx1 >=0)
            type_checked.splice(idx1,1)
        }
        this.setSieveState({
            type_item_checked,
            type_checked
        })
    }

    checkTypeAll = () => {
        const {type_item_checked} = this.props.sieveState
        const arr =Object.keys(type_item_checked)
        for(let i = 0;i <arr.length; i++){
            if(type_item_checked[arr[i]].length){
                return false
            }
        }
        return true
    }
    checkDate = (type) => {
        let min_date
        let max_date = new Date()
        const nowStr = this.getNowStr()

        switch (type) {
            case 0:
                min_date = null
                max_date = null
                break;
            case 1:
                min_date = this.weekAgo()
                break;
            case 2:
                min_date = this.monthAgo(nowStr,1)
                break
            case 3: 
                min_date = this.monthAgo(nowStr,12)
                break
            default:
                break;
        }
        
         this.setSieveState({
            min_date,
            max_date
        })
    }

    dateChange = (type,val) => {
        if(val){
            this.setSieveState({
                time_checked:'custom'
            }, ()=>this.setSieveState({
                [type]:val,
            }))
        }
    }
    getNowStr = () => {
        const now = new Date()
        const year = now.getFullYear()
        let month = now.getMonth() + 1
        let day = now.getDate()
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return year + '-' + month + '-' + day
    }
    weekAgo = (range = 1) => {
        const now = new Date().valueOf()
        const weekAgo = now - (range * 7 * 24 * 60 * 60 * 1000)
        const weekAgoStr = getTime(weekAgo, 'day')
        const timeNum = new Date(weekAgoStr).valueOf() - 8 * 60 * 60 * 1000
        const res = new Date(timeNum)
        return res
    }

    monthAgo = (date, range) => {
        function isLeapYear(year) {
            return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
        }
        function getMonthDays(year, month) { // 返回当月多少天
            return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
        }
        function addZero (key) {
            const str = key + ''
            return str.length > 1 ? str : '0' + str
        }
        let year = +date.substr(0, 4)
        const month = +date.substr(5, 2)
        const day = +date.substr(8)
        let lastMonth = month - range // 上月份
        let lastDay
        let lastYear
        if (lastMonth <= 0) {
            lastMonth = 12 + lastMonth
            lastYear = year - 1
        } else {
            lastYear = year
        }
        const lastMonthDay = getMonthDays(year, lastMonth) // 上月的天数
        if (day < lastMonthDay) {
            lastDay = day + 1
        } else { // 本月天数比上月多或等，且为月末
            if (lastMonth < 12) {
                lastMonth++
            } else {
                lastMonth = 1
                lastYear++
            }
            lastDay = 1
        }
        const timeStr = lastYear + '-' + addZero(lastMonth) + '-' + addZero(lastDay)
        const timeNum = new Date(timeStr).valueOf() - 8 * 3600000
        const res = new Date(timeNum)
        return res
    }


    stopBub = (e) => {
        e.stopPropagation();
    }

    showTip = () => {
        this.setState({
            tip_show:true
        })
    }
    closeTip = (e) => {
        e.stopPropagation()
        this.setState({
            tip_show:false
        })
    }

    reset = ()=> {
        this.props.reset&&this.props.reset()
    }
    
    setSieveState = (obj)=>{
        this.props.setSieve && this.props.setSieve(obj)
    }


    

     confirm = () =>{
        const {keyword,confirmText} = this.props
        if(keyword)
            if(confirmText ==='数据导出')
                this.props.toExport&&this.props.toExport()
            else
            this.props.toSearch && this.props.toSearch()
     }

    render (){

        const { options, tip_show } = this.state
        const { keyword , confirmText} = this.props
        const { min_date, option, max_date, area_checked, max_money, min_money, industry_checked, money_checked, time_checked,type_checked, type_item_checked } = this.props.sieveState
        return(
            <div className="sieve">
                <div className="sieve_head">
                    {
                        options.map((item,index) => {
                            return(
                                <div className={"option" + (item === option?' option_active':'')}
                                    key = {index}
                                    // onClick= {() => this.clickOption(index)}
                                    onClick = {() => this.checkBtn('option',item)}
                                >
                                    <span>{item}</span>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    option==="行业"?
                    <div className="industry_option content">
                        <ul className="industry">
                            <li className="industry_item">
                                <div className={"btn"+ (!industry_checked?" btn_active":"")}
                                     onClick={()=>this.checkBtn('industry_checked','')}
                                >全部</div>
                            </li>
                            {
                                sortArray.map((item,index) => {
                                    return(
                                        <li className="industry_item" key={index}>
                                            <div className="class_line">
                                                <div className={"class btn"+ (industry_checked===item?" btn_active":"")}
                                                     onClick={()=>this.checkBtn('industry_checked',item)}
                                                >
                                                  {item}
                                                </div>
                                            </div>
                                            <div className="items">
                                            {
                                                industry[item].map((item,index) => {
                                                    return(
                                                        <div className={"btn" + (industry_checked===item?" btn_active":"")} 
                                                             key={index}
                                                             onClick={()=>this.checkBtn('industry_checked',item)}
                                                        >
                                                            {item}
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>

                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    :''
                }
                {
                    option==="金额"?
                    <div className="money_option content">
                        <ul className="money">
                            <li className="money_item">
                                <div className={"btn" + (money_checked ===''? " btn_active":'')}
                                     onClick={()=>this.checkBtn('money_checked','')}
                                    >全部
                                </div>
                            </li>
                            <li className="money_item amount">
                                <span>价格区间</span>
                                <div className={"money_form" + (money_checked === 'custom' ? " btn_active":'')}
                                     onClick={()=>this.checkBtn('money_checked','custom')}
                                >
                                    <div className="input">
                                        <input type="text" maxLength="9" 
                                        onChange={(e)=>this.moneyChange('min_money',e)}
                                        value={min_money}
                                        />
                                        万元
                                    </div>
                                    —
                                    <div className="input">
                                        <input type="text" maxLength="9" 
                                        onChange={(e)=>this.moneyChange('max_money',e)} 
                                        value={max_money}
                                        />
                                        万元
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    :''                       
                }
                {
                    option === "时间"?
                    <div className="time_option content">
                        <ul className="time">
                            <li className="time_item">
                               {
                                   timeArray.map((item,index) => {
                                        return(
                                            <div className={"btn" + (time_checked === index? " btn_active":'')}
                                                 key={index}
                                                 onClick={()=>this.checkBtn('time_checked',index)}
                                            >
                                                {item}
                                            </div> 
                                        )
                                   })
                               }
                            </li>
                            <li className="time_item">
                                  <div className={"date_form" + (time_checked === 'custom'?" btn_active":'')}>
                                     <DatePicker
                                       mode="date"
                                       title="Select Date"
                                       value={min_date}
                                       extra=' '
                                       onChange={(date)=>this.dateChange('min_date',date)}
                                     >
                                        <List.Item className="date_picker"></List.Item>
                                     </DatePicker>
                                     <span>—</span>
                                     <DatePicker
                                       mode="date"
                                       title="Select Date"
                                       extra=' '
                                       value={max_date}
                                       onChange={(date)=>this.dateChange('max_date',date)}
                                     >
                                        <List.Item className="date_picker"></List.Item>
                                     </DatePicker>
                                           
                                  </div>                   
                            </li>
                        </ul>
                    </div>
                    :''
                }
                {
                    option === "地区"?
                    <div className="area_option content">
                        <ul className="area">
                            <li className="area_item">
                                <div className={"btn" + (!area_checked.length? ' btn_active':'')}
                                  onClick={()=>this.checkArea('all')}
                                >全国</div>
                            </li>
                            {
                                pcSequenece.map((item ,index ) => {
                                    const prop = Object.keys(item)[0]
                                    return(
                                        <li className="area_item"
                                            key={index}
                                        >
                                            <span className="first_letter">{prop}</span>
                                            <div className="province">
                                            {
                                                item[prop].map((item1,index1)=>{
                                                    return(
                                                        <div className={"btn" + (area_checked.indexOf(item1)>=0? ' btn_active':'')}
                                                             onClick={()=>this.checkArea(item1)}
                                                             key={index1}
                                                        >
                                                            {item1}
                                                        </div>
                                                    )
                                                })
                                            }
                                            </div>
                                            
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    :''
                }
                
                {
                    option === "类型" ?
                    <div className="type_option content">
                    <ul className="type">
                        <li className="type_item">
                            <div className={"btn" + ((!type_checked.length&&this.checkTypeAll())?' btn_active':'') }
                                 onClick ={() => this.checkType('all')}
                            >全部</div>
                        </li>
                        {
                            type_props.map((item,index) => {
                                return(
                                    <li className="type_item" key={index}>
                                        <div className="class_line">
                                            <div className={"btn class" + (type_checked.indexOf(item)>=0?" btn_active":'')}
                                                onClick={()=>this.checkType(item)}
                                            >
                                                 {item}
                                            </div>
                                            {
                                                item==='拟建项目'?
                                                <i className="special iconfont"
                                                    onClick={this.showTip}
                                                >
                                                <div className={'mask'+(tip_show? " on":"")}
                                                    onClick ={this.closeTip}
                                                >
                                                    <div className="tip"
                                                        onClick={this.stopBub}
                                                    >
                                                        <div className="top">“拟建项目”是指那些处于前期立项、审批阶段的项目。供应商应在立项阶段掌握项目信息，做到早介入，稳拿单。</div>
                                                        <div className="bottom"
                                                            onClick={this.closeTip}
                                                        >我知道了</div>
                                                    </div>
                                                </div>
                                                </i>
                                                :''
                                            }
                                        </div>
                                        {
                                            type[item].map((item1,index1) => {
                                                return(
                                                    <div className={"btn" + (type_item_checked[item].indexOf(item1)>=0?" btn_active":'')}
                                                        onClick={()=>this.checkTypeItem(item,item1)}
                                                        key={index1}
                                                    >
                                                        {item1}
                                                    </div>
                                                )
                                            })
                                        }
                                    </li>
                                )

                            })
                        }
                    </ul>
                </div>
                :''
                }
                <div className="footer_btn">
                    <div className="reset" onClick={this.reset}>重置</div>
                    <div className={"confirm" + (keyword? " confirm_active":'')}
                        onClick={this.confirm}
                    >{confirmText?confirmText:'确定'}</div>
                </div>
            </div>
        )
    }

}

export default withRouter(Sieve)
