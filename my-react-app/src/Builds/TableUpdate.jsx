import React, { Component } from 'react';
import Tables from '../Component/Tables/Tables'
import { Searchs, ActionAPI, Del } from '../Math/APIconfig'
import { getFetch, getTime, getTimeFetch } from '../Math/Math'
import { Collapse, notification, Card, Select, Input, Form, DatePicker, Row, Col } from 'antd'
import TableUpdateAction from './ComponentP/TableUpdateAction'
const Panel = Collapse.Panel
const { Option } = Select
const InputGroup = Input.Group
const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker;

class TimeRelatedForm extends Component {
    constructor(props) {
        super(props)
        this.clear = {}
        this.state = {
            //表格数据
            Data: [],
            //表格列
            columns: [{
                title: 'PK',
                dataIndex: 'PK',
                key: 'PK',
            }, {
                title: 'BranchID',
                dataIndex: 'BranchID',
                // key: 'PK',
            }, {
                title: 'ScriptType',
                dataIndex: 'ScriptType',
                // key: 'PK',
            }, {
                title: 'Author',
                dataIndex: 'Author',
                // key: 'PK',
            }, {
                title: 'SqlName',
                dataIndex: 'SqlName'
            }],
            ActiveKey: ['1'],
            //表单数据
            TableValue: {},
            clearTable: false,
            disabled: true,
            clearObj: {
                Author: '',
                BranchID: "STD",
                CreateTime: getTime(),
                DeleteFlag: 0,
                FK: -1,
                GuidString: null,
                LastModifyTime: getTime(),
                LastUpdater: null,
                LineID: -1,
                Module: '',
                Note: '',
                OriginalGuidString: null,
                PK: -1,
                QueryDataRightCode: null,
                ScriptType: '',
                SoftSystemCode: "GOS",
                SqlName: '',
                SqlScripe: '',
                TableDisplayerGuid: null,
                Tag: null,
                Version: 2,
                VersionNum: 2,
                WorkFlowGuid: "",
                WorkFlowState: "",
            }
        }
    }

    //初始加载数据
    componentDidMount() {
        getFetch(Searchs().SQLManage, (res) => {
            // console.log(res)
            this.setState({
                Data: res,
                TableValue: this.state.clearObj
            })
        })
    }
    //点击搜索加载数据
    GetData = (SearchValue) => {
        getFetch(Searchs(SearchValue).SQLManage, (res) => {
            // console.log(res)
            this.setState({
                Data: res,
                TableValue: this.state.clearObj
            })
        })
    }
    RowSelected = (e) => {
        // console.log(e)
        return {
            onClick: (e) => {
                console.log(e)
            }
        }
    }
    //激活得Collapse
    callback = (key) => {
        if (key === 1) {
            this.setState({
                ActiveKey: key === undefined ? ['2'] : ['1'],
                disabled: true
            })
        } else {
            this.setState({
                ActiveKey: key === undefined ? ['2'] : ['1'],
            })
        }

    }
    //点击表单获取得数据
    TableEmitData = (TableValue) => {
        // console.log(TableValue)
        getTimeFetch(ActionAPI(TableValue.PK).SQL, (res) => {
            console.log(res)
            this.setState({
                TableValue: JSON.parse(JSON.stringify(res)),
                disabled: true
            })
        })
    }
    AddAction = (name) => {
        if (name === 'Add') {
            this.clear = JSON.parse(JSON.stringify(this.state.clearObj))
            this.clear.CreateTime = getTime()
            this.clear.LastModifyTime = getTime()
            this.setState({
                TableValue: this.clear,
                ActiveKey: ['2'],
                disabled: false,
            })
        } else if (name === 'Edit') {
            if (this.state.TableValue.PK === undefined) {
                notification.warning({
                    message: '错误提示',
                    description: '请选择一个节点',
                });
            } else {
                this.clear = this.state.TableValue
                this.clear.LastModifyTime = getTime()
                this.setState({
                    ActiveKey: ['2'],
                    disabled: false
                })
                return
            }
        } else {
            if (this.state.TableValue.PK === undefined) {
                notification.warning({
                    message: '错误提示',
                    description: '请选择一个节点',
                });
            } else {
                //TODO 删除
                getTimeFetch(Del(this.state.TableValue.PK).SQL, (res) => {
                    if (res === 'True') {
                        notification.success({
                            message: '提示',
                            description: '删除成功'
                        })
                        this.GetData()
                    } else {
                        notification.warning({
                            message: '提示',
                            description: res
                        })
                    }
                })
            }
        }
    }

    render() {
        const { Data, columns, ActiveKey, TableValue, clearTable, disabled } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Card>
                    <Form layout='inline'>
                        <FormItem
                            label="状态"
                        >
                            {getFieldDecorator('State')(
                                <Select>
                                    <Option value="0">未发布</Option>
                                    <Option value="1">已发布</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            label="类型"
                        >
                            {getFieldDecorator('SQLTYPE')(
                                <Select>
                                    <Option value="-1">全部类型</Option>
                                    <Option value="0">新增表</Option>
                                    <Option value="1">修改表</Option>
                                    <Option value="2">创建视图</Option>
                                    <Option value="3">过程函数脚本</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="禅道状态"
                        >
                            {getFieldDecorator('BugType')(
                                <Select>
                                    <Option value="0">需求</Option>
                                    <Option value="1">BUG</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label="BUGID"
                        >
                            {getFieldDecorator('BugIDList', {
                                rules: [{ required: true, message: 'Please input BUGID!' }],
                            })(
                                <Input autoComplete="off"></Input>
                            )}
                        </FormItem>
                        <FormItem

                            label="RangePicker"
                        >
                            {getFieldDecorator('range-picker', {
                                rules: [{ type: 'array', required: true, message: 'Please select time!' }],
                            })(
                                <RangePicker />
                            )}
                        </FormItem>
                    </Form>
                </Card>
                <Collapse
                    bordered={false}
                    defaultActiveKey={['1']}
                    onChange={this.callback.bind(this)}
                    accordion
                    activeKey={ActiveKey}
                >
                    <Panel header='表单' key="1" showArrow={true}>
                        <Tables
                            Data={Data}
                            columns={columns}
                            TableEmitData={this.TableEmitData.bind(this)}
                            clearTable={clearTable}
                        ></Tables>
                    </Panel>
                    <Panel key='2' showArrow={true} header='详细信息'>
                        <TableUpdateAction
                            clear={this.clear}
                            TableValue={TableValue}
                            disabled={disabled}
                        ></TableUpdateAction>
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

const TableUpdate = Form.create()(TimeRelatedForm);
export default TableUpdate;
