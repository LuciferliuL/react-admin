import React, { Component } from 'react';
import { Form, Input, Select, Col, Button, Row, Switch } from 'antd'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input;
const InputGroup = Input.Group
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};
const Widths = { width: 100 + '%' }
class SimpleFlag extends Component {
    state = {
        IsPaging: true
    }
    componentWillReceiveProps(next) {
        if (next.QueryExtend.IsPaging === 1) {
            this.setState({
                IsPaging: true
            })
        } else {
            this.setState({
                IsPaging: false
            })
        }
    }
    ChangeSelect = (key, value) => {
        // console.log(value)
        this.props.handleChange(key, value)
    }
    onChange(key, checked) {
        // console.log(`switch to ${checked}`);
        this.props.handleChange(key, checked)
    }
    handleChange = (key, e) => {
        let value = e.target.value
        this.props.handleChange(key, value)
    }
    render() {
        const { disableds, QueryExtend } = this.props
        // console.log(QueryExtend)
        return (
            <div>
                <FormItem label="页签名称" {...formItemLayout}>
                    <Input value={QueryExtend.DQueryCaption} disabled={disableds} onChange={this.handleChange.bind(this, 'DQueryCaption')}></Input>
                </FormItem>
                <FormItem label="SQL名" {...formItemLayout}>
                    <InputGroup>
                        <Row>
                            <Col span={14}>
                                <Input value={QueryExtend.DQueryName} disabled={disableds} onChange={this.handleChange.bind(this, 'DQueryName')} />
                            </Col>
                            <Col span={10}>
                                <Button type='primary' disabled={disableds}>123</Button>
                            </Col>
                        </Row>
                    </InputGroup>
                </FormItem>
                <FormItem label="数据来源" {...formItemLayout}>
                    <InputGroup>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Select
                                    value={QueryExtend.DataSource}
                                    onChange={this.ChangeSelect.bind(this,'DataSource')}
                                    style={Widths}
                                    disabled={disableds}>
                                    <Option value={0}>集中服务器</Option>
                                    <Option value={1}>分公司服务器</Option>
                                    <Option value={2}>SOLR</Option>
                                </Select>
                            </Col>
                            <Col span={12}>
                                是否分页 <Switch
                                    defaultChecked={this.state.IsPaging}
                                    onChange={this.onChange.bind(this, 'IsPaging')}
                                    checkedChildren='true'
                                    uncheckedchildren='false'
                                    disabled={disableds}
                                />
                                是否使用缓存服务器 <Switch
                                    defaultChecked
                                    onChange={this.onChange.bind(this, 'IsUseCacheServer')}
                                    checkedChildren='true'
                                    uncheckedchildren='false'
                                    disabled={disableds}
                                />
                            </Col>
                        </Row>
                    </InputGroup>
                </FormItem>
                <FormItem label="SQL内容" {...formItemLayout}>
                    <TextArea
                        rows={10}
                        disabled={disableds}
                        value={QueryExtend.DQuerySql.SqlScripe}
                        onChange={this.handleChange.bind(this, 'SqlScripe')}></TextArea>
                </FormItem>
            </div>
        );
    }
}

export default SimpleFlag;