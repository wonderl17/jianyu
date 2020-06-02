import React, {Component} from 'react'
import {withRouter} from 'react-router';

import './advice.scss'

class Advice extends Component  {
    state = {
        words:'',
        words_length:0
    }
    onTextAreaChange = (e) => {
        let val = e.target.value
        val = val.substr(0,200)
        let words_length = val.length
        this.setState({
            words :val,
            words_length
        })
    }

    submit = () => {
        const {words} = this.state
        if(!words)
            return
        else {
            alert('感谢您的意见反馈，我们已收到！')
            setTimeout(()=>{
                this.props.history.push('/home')
            },500)
        }
    }

    render () {
        const {words,words_length} = this.state
        return(
            <div className="advice">
                <div className="content">
                    <div className="form">
                        <textarea name="advice" id="advice_area" cols="30" rows="10" placeholder="1、请输入您的宝贵意见&#10;2、如果有好的信息源，请告诉我们"
                            onChange={this.onTextAreaChange}
                            value={words}
                        ></textarea>
                        <div className="statistics">
                            <span>{words_length}</span>/200字
                        </div>
                    </div>
                    <div className={"btn" + (words? ' btn_active':'')}
                        onClick={this.submit}
                    >
                        提交
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Advice)