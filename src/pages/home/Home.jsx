import React, {Component} from 'react'
import {withRouter} from 'react-router';
import Swiper from "swiper"
import DataFlow from '../../compoments/dataflow/DataFlow';
import ToVerify from '../../compoments/toVerify/ToVerify'
import {search} from '../../api/index'
import "swiper/css/swiper.css"
import './home.scss'
// const bannerUrl = ['../../assets/images/banner1','../../assets/images/banner2','../../assets/images/banner3']
class Home extends Component {
    state = {
        data : []
    }
    
    componentDidMount(){
        new Swiper('.swiper-container',{
            loop: true, // 循环模式选项
            autoplay:false,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
        });
        this.initDataFlow()
    }

    initData = (data) => {
        let dataArray = []
        for(const item of data){
            dataArray = dataArray.concat(item.data)
        }
        return dataArray
    }
    
    initDataFlow = async () => {
        const config = {"db_id":4,"search_type":"all", "size": 20,"filter_conditions":{"not_null":["title", "bid_company.stock_company.name", "timestamp"]}}
        const {session_id, sig, token} = this.state
        if (session_id) {
            config.session_id = session_id
            config.sig = sig
            config.token = token
            this.clearVerify()
        }
        const result = await search(config)
        if(result.status === '1'){
            if(!result.data.to_verify)
            {
                const dataFlow = this.initData(result.data.info_flow_list)
                this.setState({
                    data: dataFlow
                })
            }
            else{
                this.setState({
                    verifyWin:true
                })
            }
        }
    }

    toSearch = () => {
        this.props.history.push('/search')
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
            this.initDataFlow()
                // this.clearVerify()
        })
    }
    clearVerify = () => {
        this.setState({
            session_id: '',
            sig: '',
            token: ''
        })
    }
    render(){
        const {data ,verifyWin} = this.state
        return (
            <div className="home">
                {
                    verifyWin ? 
                    <ToVerify
                    cancel={this.closeVerifyWin}
                    verifySuccess={this.verifySuccess}
                    />: ''
                }
                <div className="top">
                    <div className="home_search">
                        <div className="home_search_left"
                            onClick={this.toSearch}    
                        >
                            <span>示例：税务局 软件</span>
                        </div>
                        <div className="home_search_right">
                            <div className="img"></div>
                        </div>
                    </div>
                    <div className="home_banner">
                        <div className="swiper-container lunbo">
                            <div className="swiper-wrapper">
                                <div className="swiper-slide">
                                    <a href="/#">
                                        <img src={require("../../assets/images/banner1.jpg")} alt=""/>
                                    </a>
                                </div>
                                <div className="swiper-slide">
                                    <a href="/#">
                                        <img src={require("../../assets/images/banner2.jpg")} alt=""/>
                                    </a>
                                </div>
                                <div className="swiper-slide">
                                    <a href="/#">
                                        <img src={require("../../assets/images/banner3.png")} alt=""/>
                                    </a>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="home_tab">
                    <div className="tab_container">
                        <a href="/search_zb1" className="tab_item">
                            <img src={require("../../assets/images/tab_item1.png")} alt=""/>
                            <span>搜中标企业</span>
                        </a>
                        <a href="/search?data_export=1" className="tab_item">
                            <img src={require("../../assets/images/tab_item2.png")} alt=""/>
                            <span>数据导出</span>
                        </a>
                        <a href="/#" className="tab_item">
                            <img src={require("../../assets/images/tab_item3.png")} alt=""/>
                            <span>商机管理</span>
                        </a>
                        <a href="/#" className="tab_item">
                            <img src={require("../../assets/images/tab_item4.png")} alt=""/>
                            <span>APP下载</span>
                        </a>

                    </div>
                </div>
               <div className="data_content">
                    <h3 className="data_nav">
                        最新标讯
                    </h3>
                     {
                         data.length?
                         <DataFlow
                             dataArray = {data}
                         />
                         :''
                    }
               </div>

                
                <div className="tips">
                    <p className="tips_text home_1"> 设置订阅关键词，随时接收最新招标信息</p>
                    <p className="tips_text home_2"> 为了使您接收更多信息，可对关键词进行新增或修改。</p>
                    <p className="tips_text home_3"> 您未设置关键词，设置后接收信息更精准!</p>
                    <p className="tips_text home_4"> 开通VIP订阅，获取更多订阅信息。</p>
                    <div className="tips_btn">
                        <a href="/#" className="home_toset">去订阅</a>
                    </div>
                    <div className="tips_btn" style={{display:'none'}}>
                        <a href="/#" className="home_todetails">了解详情</a>
                    </div>
                </div>
            </div>
            
        )
    }

}

export default withRouter(Home)