import React, { Component } from 'react';
import { Cascader, Spin } from 'antd';
import { getFetch, ObjRegister } from '../../Math/Math';
import { GetPV } from '../../Math/APIconfig'
import './Cascader.css'

class Cascaders extends Component {
    state = {
        options: [],
        first: '',
        secend: '',
        third: '',
        loading:false
    }
    componentWillMount() {
        // console.log(this.props.API)
        const { API } = this.props
        this.setState({
            first: API.first,
            secend: API.secend,
            third: API.third,
            loading:true
        }, () => {
            getFetch(GetPV()[this.state.first], (res) => {
                let data = JSON.parse(res.Result)
                // console.log(data)
                let option = data.aggregations.pv_result.buckets
                // console.log(option)
                option.map((v) => {
                    v.isLeaf = false
                    v.LeveL = 1
                    return v
                })
                option = ObjRegister(option)
                this.setState({
                    options: option,
                    loading:false
                })
            })
        })
    }
    onChange = (value, selectedOptions) => {
        // console.log(value, selectedOptions)
        this.props.handleChangeState(value)
    }
    loadData = (selectedOptions) => {
        // console.log(selectedOptions)
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        if (targetOption.LeveL === 1) {
            getFetch(GetPV(targetOption.key)[this.state.secend], (res) => {
                let data = JSON.parse(res.Result)
                let option = data.aggregations.pv_result.buckets
                option.map((v) => {
                    v.isLeaf = false
                    v.LeveL = 2
                    return v
                })
                targetOption.children = option;
                // console.log(option)
                option = ObjRegister(option)
                this.setState({
                    options: [...this.state.options],
                }, () => { targetOption.loading = false; });
            })
        } else if (targetOption.LeveL === 2) {
            getFetch(GetPV(selectedOptions[0].key, targetOption.key)[this.state.third], (res) => {
                let data = JSON.parse(res.Result)
                let option = data.aggregations.pv_result.buckets
                // option.map((v) => {
                //     v.isLeaf = false
                //     v.LeveL = 3
                // }) 如果还有后续可以使用
                targetOption.children = option;
                option = ObjRegister(option)
                this.setState({
                    options: [...this.state.options],
                }, () => { targetOption.loading = false; });
            })
        }

    }
    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        // console.log(option)
        if (i === labels.length - 1) {
            return (
                <span key={option.key}>
                    {label} (<b>{option.doc_count}</b>)
            </span>
            );
        }
        return <span key={option.key + 'key'}>{label} / </span>;
    });
    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <Cascader
                        className='CascaderWidth'
                        options={this.state.options}
                        expandTrigger="hover"
                        onChange={this.onChange}
                        loadData={this.loadData}
                        changeOnSelect
                        displayRender={this.displayRender}
                        filedNames={{ label: 'Port', value: 'key', children: 'children', code: 'doc_count' }}
                    />
                </Spin>
            </div>
        );
    }
}

export default Cascaders;