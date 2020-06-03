import React, {Component} from 'react'
import {withRouter} from 'react-router';
import Sieve from '../../compoments/sieve/Sieve'
import SearchResult from '../../compoments/searchResult/SearchResult'
import ToVerify from '../../compoments/toVerify/ToVerify'

import {search} from '../../api/index';


import './search.scss'


class Search extends Component {
    state = {
        show_history :false,
        search_word:'',
        search_history:[],
        history_cursor: -1,
        show_sieve: false,
        show_result: false,
        data_flow:[],
        cursor:'',
        options:[],
        placeholder:"示例：华为",
        sieve:{
            min_money: '',    
            max_money: '',
            max_date: null,
            min_date: null,
            search_type: 'title',
            area_checked:[],
            //以上部分是接口参数
            option : '行业',
            industry_checked:'',
            money_checked:'',
            time_checked: 0,
            type_checked:[],
            type_item_checked: {
                拟建项目:[],
                招标预告:[],
                招标公告:[],
                招标结果:[],
                招标信用信息:[] 
            },

        },
        cantDrop:false,
        toMore:false,
        urlParams:{},
        verifyWin:false,
        show_blank:true,
        saveContext:{},
        session_id: '',
        sig: '',
        token: '',
        type:''
    }

    componentDidMount = () => {
       this.checkDataType()
       this.setOptions()
       this.fromOrder()

    }
    componentDidUpdate = () => {

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
        
        if(params.hasOwnProperty('data_export')&&params.data_export === '1'){
            this.setState({
                show_sieve:true,
                confirmText:'数据导出'
            },()=>{
            })
        }
        this.setState({
            urlParams:params
        })
    }

    fromOrder =  ()=>{
        const from_order = sessionStorage.getItem('from_order')
        if(from_order === 'true'){
            const obj = JSON.parse(sessionStorage.getItem('sieve_info'))
            this.toSearch(obj)
            sessionStorage.setItem('from_order','false')
            const search_word = JSON.parse(sessionStorage.getItem('search_word'))
            this.setState({
                search_word
            })
        }
    }
    setOptions = () => {
        const {sieve} = this.state
        const {options,placeholder} = this.props
        if(options && options.length){
            sieve.option = options[0]
            this.setState({
                options,
                sieve,
            })
        }
        if(placeholder){
            this.setState({
                placeholder
            })
        }
    }

    inputFocus = () => {
        const str = localStorage.getItem('search_history')
        if(str){
            const  search_history = JSON.parse(str)
            this.setState({
                show_history :true,   
                search_history
            })
        }
        
    }
    inputBlur = () => {
        this.setState({
            show_history :false   
        })
    }

    inputChange = (e) => {
        const val = e.target.value
        this.setState({
            search_word:val,
        })
    }

    clearIpt = () => {
        this.setState({
            search_word:''
        })
    }
    addHistory = () => {
        const {search_history,search_word} = this.state
        if(search_word ){
            const idx =search_history.indexOf(search_word)
            if(idx >= 0){
                search_history.splice(idx,1)
            }
            search_history.unshift(search_word)
            if(search_history.length > 5){
                search_history.pop()
            }
            localStorage.setItem('search_history',JSON.stringify(search_history))
            this.setState({
                search_history,
                show_history:false
            })
        }
    }


    clickHistoryItem = (search_word) => {
        this.setState({
            search_word,
            show_history:false
        },()=>{
             this.toSearch()
        })
    }
    clearHistory = () => {
        localStorage.setItem('search_history','')
        this.setState({
            search_history:[],
            show_history:false
        })
    }
    

    clearAll = (e) => {
        const { show_history } = this.state
        if(show_history)
        this.setState({
            show_history:false
        })
    }


    stopBub = (e) => {
        e.stopPropagation();
    }

    showSieve = () => {
        const {show_sieve,show_blank} = this.state
        if(show_sieve){
            if(!show_blank)
                this.setState({
                    show_result: true,
                })
            this.setState({
                show_sieve: false,
            })
        }
        else {
            this.setState({
                show_result: false,
                show_sieve: true
            })
        }
    }

    searchReset = ()=> {
        this.setState({
            search_word:'',
            sieve:{
                min_money: '',
                max_money: '',
                max_date: null,
                min_date: null,
                search_type: 'title',
                area_checked:[],
                option : 0,
                industry_checked:'',
                money_checked:'',
                time_checked: 0,
                type_checked:[],
                type_item_checked: {
                    拟建项目:[],
                    招标预告:[],
                    招标公告:[],
                    招标结果:[],
                    招标信用信息:[] 
                }
            }
        })
    }
    
    setSieve = (obj) => {
        const  {sieve} = this.state
        if(obj){
            console.log(obj);
            
            Object.assign(sieve,obj) 
            this.setState({
                sieve
            })
        }
    }

    setSearchType = (type) => {
        const  {sieve} = this.state
        if(type){
            sieve.search_type = type
            this.setState({
                sieve
            },() => {
                this.toSearch()
            })
        }
        
    }
    keyDown = (e) => {
        const keyCode = e.keyCode
        let {history_cursor,search_history,show_history} = this.state
        if(keyCode === 13){
            e.preventDefault()
            this.toSearch()
        }
        if(show_history){
            if(keyCode >=37 && keyCode <= 40){
                e.preventDefault()
                if(keyCode === 40){
                    if(history_cursor < search_history.length -1){
                       history_cursor ++
                    }
                }
                if(keyCode === 38){
                    if(history_cursor >= -1){
                        history_cursor --
                    }
                }
                this.setState({
                    history_cursor,
                    search_word: history_cursor>=0? search_history[history_cursor]:''
                })
            } 
        }
    }

    toExport = ()=> {
        const obj = this.integration()
        const {search_word} = this.state
        sessionStorage.setItem('sieve_info',JSON.stringify(obj))
        sessionStorage.setItem('search_word',JSON.stringify(search_word))
        this.props.history.push('/export')
    }

    integration = () => {
        const {min_date,max_date,max_money,min_money, area_checked,search_type} = this.state.sieve
        const {search_word} = this.state
        let area = area_checked.map((item) => {
            return {
                key_field:"project_province",
                value_field: item,
                keyword:[]
            }
        })
        let obj = {
            db_id: 4,
            size : 20,
            search_type : search_type,
            search_word : search_word,
            filter_conditions : {
                date :{
                    publish_time:{
                    }
                },
                keyword: area,
                not_null:["title", "bid_company.stock_company.name", "timestamp"],
                number:{
                    bid_money:{
                    }
                }
            }
        }
        if(max_date || min_date){
            if(min_date)
                obj.filter_conditions.date.publish_time.gte = min_date.getTime()
            if(max_date)
                obj.filter_conditions.date.publish_time.lte = max_date.getTime()
        } else {
            delete  obj.filter_conditions.date
        }

        if(max_money || min_money){
            if(min_money)
                obj.filter_conditions.number.bid_money.gte = Number(min_money)
            if(max_money)
                obj.filter_conditions.number.bid_money.lte = Number(max_money)
        } else {
            delete  obj.filter_conditions.number
        }
        if(!area.length)
            delete obj.filter_conditions.keyword
        if(!search_word)
            delete obj.search_word
        return obj
     }

    initData = (data) => {
        let dataArray = []
        for(const item of data){
            dataArray = dataArray.concat(item.data)
        }
        return dataArray
    }

    toSearch = async (obj) => {
        const {session_id, sig, token} = this.state
        if(!obj)
            obj = this.integration()
        if (session_id) {
            obj.session_id = session_id
            obj.sig = sig
            obj.token = token
            this.clearVerify()
        }
        this.addHistory()
        this.setState({
            show_loading:true,
        },()=>{
            this.refs.search_input.blur()
        })
        const res = await search(obj)
        if(res&&res.status === '1'){
            if(!res.data.to_verify){
                if(res.data.info_flow_list.length){
                    let data = res.data.info_flow_list
                    let arr = this.initData (data)
                    const data_flow =  arr
                    const cursor = data_flow.length? data_flow[data_flow.length - 1].cursor:''
                    this.setState({
                        data_flow,
                        cursor,
                    },()=>{
                        if(arr.length<20 && data_flow.length )
                        this.setState({
                            cantDrop: true
                        }) 
                        else {
                            this.setState({
                                cantDrop :false
                            })
                        }
                    })
                }
            } else {
                this.setState({
                    verifyWin:true,
                    saveContext:obj,
                    type:'toSearch'
                })
            }
        }
        this.setState({
            show_loading: false,
            show_sieve: false,
            show_result: true,
            show_blank:false
        },()=>{
            // sessionStorage.setItem('sieve',JSON.stringify(this.state.sieve))
        })
    }

    dataDrop = async (obj) => {
        const {session_id, sig, token} = this.state
        let {data_flow,cursor,cantDrop} = this.state
        if(!cantDrop){
            if(!obj)
                obj = this.integration()
            if (session_id) {
                obj.session_id = session_id
                obj.sig = sig
                obj.token = token
                this.clearVerify()
            }
            obj.cursor = cursor
            this.setState({
                dataLoading:true
            })
            const res = await search(obj)
            if(res&&res.status === '1'){
                if(!res.data.to_verify){
                    if(res.data.info_flow_list.length){
                        let data = res.data.info_flow_list
                        let arr = this.initData (data)
                            data_flow = data_flow.concat(arr)
                            cursor = data_flow.length? data_flow[data_flow.length - 1].cursor:cursor
                            this.setState({
                                data_flow,
                                cursor,
                            },()=>{
                                if(arr.length<20){
                                    this.setState({
                                        cantDrop: true
                                    })
                                }
                                if(data_flow.length>=60)
                                    this.setState({
                                        toMore:true,
                                        cantDrop: true
                                    })
                                })
                       
                    }
                } else {
                    this.setState({
                        verifyWin:true,
                        saveContext:obj,
                        type:'dataDrop'
                    })
                }
            }
            this.setState({
                dataLoading:false
            })
        }
        
    }

    closeVerifyWin = () => {
        this.setState({
            verifyWin: false
        })
    }
    verifySuccess = (obj) => {
        this.setState({
            verifyWin: false,
            ...obj
        }, () => {
            this.continue()
        })
    }
    clearVerify = () => {
        this.setState({
            session_id: '',
            sig: '',
            token: ''
        })
    }
    continue = () => {
        const {saveContext,type} = this.state
        if(type === 'toSearch'){
            this.toSearch(saveContext)
        } else if (type === 'dataDrop'){
            this.dataDrop(saveContext)
        }
    }


    render(){
        const {show_history,search_word,search_history,show_sieve,show_loading,show_result,data_flow,sieve,history_cursor, options, placeholder ,cantDrop ,confirmText, verifyWin, show_blank, dataLoading, toMore} = this.state
        return(
            <div className="search" 
                 onClick={this.clearAll}
            >
                {
                    verifyWin ? 
                    <ToVerify
                    cancel={this.closeVerifyWin}
                    verifySuccess={this.verifySuccess}
                    />: ''
                }
                {
                    <form action="" className="wxhead">
                        <div className="search_head">
                            <input type="text" 
                                className="form_control search_input" 
                                maxLength="50" 
                                placeholder={placeholder}
                                autoComplete="off"
                                onFocus={this.inputFocus}
                                onChange={this.inputChange}
                                value={search_word}
                                onClick={this.stopBub}
                                onKeyDown={this.keyDown}
                                ref="search_input"
                            />
                            {
                                show_history?
                                <div className="input_div"
                                    onClick={this.stopBub}
                                >
                                     <div className="history_item history_title">
                                         <span className="iconfont">历史搜索</span>
                                         <i className="iconfont"
                                            onClick={this.clearHistory}
                                         ></i>
                                     </div>
                                     <ul className="history_content">
                                         {
                                             search_history.length?
                                             search_history.map((item,index) => {
                                                 return(
                                                        <li className={"history_item" + ((history_cursor===index)? ' history_item_active':'')}
                                                            key={index}
                                                            onClick={() => this.clickHistoryItem(item)}
                                                        >
                                                             {item}
                                                        </li>
                                                 )
                                             }):''
                                            }
                                     </ul>
                                </div>
                                :''
                            }

                            <span className="screen"
                                onClick={()=>this.showSieve()}
                            >筛选</span>

                            {
                                search_word?
                                <div className="">
                                    <span className="clearIpt"
                                          onClick={this.clearIpt}
                                    >
                                        <img src={require('../../assets/images/delete_icon.png')} alt=""/>    
                                    </span>
                                    <span className="query"
                                          onClick={()=>this.toSearch()}
                                    >
                                        <img src={require('../../assets/images/search_icon.png')} alt=""/>
                                    </span>
                                </div>
                                :''
                            }
                        </div>
                    </form>
                }
                {
                    show_sieve?
                    <Sieve reset={this.searchReset}
                           toSearch = {()=>this.toSearch()}
                           setSieve = {this.setSieve}
                           sieveState = {sieve}
                           keyword={search_word}
                           has_option={options}
                           toExport = {this.toExport}
                           confirmText = {confirmText}
                    />
                    :"" 
                }
                {
                    show_loading?
                    <div className="loading">
                        <div className="item">
                            <div className="rotate"></div>
                        </div>
                    </div>
                    :''
                }
                {
                    show_result?
                    <SearchResult data={data_flow}
                    setSearchType = {this.setSearchType}
                    search_word ={search_word}
                    dataDrop = {this.dataDrop}
                    cantDrop ={cantDrop}
                    toMore = {toMore}
                    dataLoading = {dataLoading}
                    toExport = {this.toExport}
                    />
                    :''
                }
                {
                    !show_result&&!show_sieve&&show_blank?
                    <div className="blank"></div>
                    :''
                }
            </div>

        )
    }

}


export default withRouter(Search)