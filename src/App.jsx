import React,{Component} from 'react';
import {Switch, Route,withRouter,Redirect} from 'react-router';
import Home from './pages/home/Home'
import Subscribe from './pages/subscribe/Subscribe';
import Search from './pages/search/Search'
import Export from './pages/export/Export'
import SearchZb from './pages/searchZb/SearchZb'
import SearchZb_1 from './pages/searchZb/SearchZb_1'
import './App.scss';
import './assets/css/reset.css'
import Advice from './pages/advice/Advice';

class App extends Component {
  componentDidMount(){
    this.setFontSize(100)
    this.resizeListen()
  }
 


  setFontSize = (baseFontSize) => {
      const _baseFontSize = baseFontSize || 75;
      const ua = navigator.userAgent;
      const matches = ua.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
      const isIos = navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
      let dpr = window.devicePixelRatio || 1;
      if (!isIos && !(matches && matches[1] > 534)) {
          // 如果非iOS, 非Android4.3以上, dpr设为1;
          dpr = 1;
      }
      let scale = 1 / dpr;
      let metaEl = document.querySelector('meta[name="viewport"]');
      if (!metaEl) {
          metaEl = document.createElement('meta');
          metaEl.setAttribute('name', 'viewport');
          window.document.head.appendChild(metaEl);
      }
      metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
      let fsize = (document.documentElement.clientWidth) / (750 / _baseFontSize)
      document.documentElement.style.fontSize = fsize+'px';
  }

  resizeListen = () => {
    window.addEventListener('resize', this.resizeHandler)
  }

  resizeHandler = () => {
    this.setFontSize(100)
  }

  render () {
    return (
      <div className="app">
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/subscribe' component={Subscribe}/>
          <Route path='/search' component={Search}/>
          <Route path='/export' component={Export}/>
          <Route path='/search_zb' component={SearchZb}/>
          <Route path='/search_zb1' component={SearchZb_1}/>
          <Route path='/advice' component={Advice}/>
          <Redirect from='/' to='/home'/>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)
