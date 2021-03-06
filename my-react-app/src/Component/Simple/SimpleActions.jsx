import React from 'react'
import { Form, Input, Select, Row, Col, Button, notification, Spin, Card, Collapse, Switch, Tabs, Icon } from 'antd';
import { postFetch, getTime } from '../../Math/Math'
import { Save } from '../../Math/APIconfig'
import SimpleBtn from './SimpleBtn'
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group
const TabPane = Tabs.TabPane
const { TextArea } = Input
const Panel = Collapse.Panel;
let uuid = 0;
const Widths = { width: 100 + '%' }
const FormList = ['BillTypeCode', 'DQueryParamAssembly', 'DQueryMasterAssembly', 'DQuerySlaveAssembly', 'Author', 'DQueryCaption', 'DQueryParamFullName', 'Module',
    'DQueryMasterFullName', 'DQuerySlaveFullName', 'LayoutMode', 'QueryExtend', 'Settings']
const FormListQuery = ['DQueryCaption', 'DataSource', 'IsPaging', 'IsUseCacheServer', 'DQuerySql.SqlScripe', 'DQuerySql.SqlName']
const OptionValue = ['财务模块', '采购模块', '价格模块', '结算模块', '库存模块', '其他模块', '销售模块', '资金模块', '系统设置模块']
const OptionsLayValue = ["fluidLayout", '0']
const SettingsOri = [
    'AllowExport',
    'AllowReverseState',
    'AllowWorkFlowQuery',
    'PrintAll',
    'AllowPrint',
    'AllowReset',
    'AllowDelete',
    'AllowEdit',
    'AllowView',
    'ShowOrgSelect',
    'ParamsCheck',
    'SQLRebuilding',
    'IsLinkOnOrgSelect',
    'AllowOrgMultiSelect',]
const MenuAdmin = [
    { Name: '允许导出数据', Code: 'AllowExport' },
    { Name: '允许状态扭转', Code: 'AllowReverseState' },
    { Name: '允许查看工作流', Code: 'AllowWorkFlowQuery' },
    { Name: '允许打印所有', Code: 'PrintAll' },
    { Name: '允许打印', Code: 'AllowPrint' },
    { Name: '允许重设', Code: 'AllowReset' },
    { Name: '允许删除', Code: 'AllowDelete' },
    { Name: '允许编辑', Code: 'AllowEdit' },
    { Name: '允许查看', Code: 'AllowView' },
    { Name: '允许查分公司数据', Code: 'ShowOrgSelect' }
]
const ServerAdmin = [
    { Name: '查询前参数检查', Code: 'ParamsCheck' },
    { Name: '允许SQL自动重构', Code: 'SQLRebuilding' }
]
const FunAdmin = [
    { Name: '分公司勾选联动', Code: 'IsLinkOnOrgSelect' },
    { Name: '分公司允许多选', Code: 'AllowOrgMultiSelect' }
]
class RegistrationForm extends React.Component {
    constructor(props) {
        super(props)
        this.BookOpen = []//记录有没有打开book为一个数组
        this.BookData = []//记录添加进来得book 
        this.state = {
            submitData: {},
            disabledCopy: true,
            disabled: true,
            loading: false,
            counts: 0,//用来记录有几组QueryExtend
            QueryExtend: {
                BillTypeCode: '',
                BranchID: "STD",
                CreateTime: getTime(),
                DQueryCaption: '',
                DQueryName: '',
                DQuerySql: {},
                DataSource: 1,
                DeleteFlag: 0,
                FK: 0,
                GuidString: null,
                IsPaging: 0,
                IsUseCacheServer: 1,
                LastModifyTime: getTime(),
                LineID: 0,
                Note: null,
                OriginalGuidString: null,
                PK: -1,
                QuerySqlGuid: null,
                SoftSystemCode: "GOS",
                SolrBranch: null,
                SolrScript: null,
                SolrScriptGuid: null,
                Tag: null,
                Version: 1,
                WorkFlowGuid: "",
                WorkFlowState: "",
            },
            DQuerySql: {
                Author: this.props.clear.Author,
                BranchID: "STD",
                CreateTime: getTime(),
                DeleteFlag: 0,
                FK: -1,
                GuidString: null,
                LastModifyTime: getTime(),
                LastUpdater: null,
                LineID: -1,
                Module: null,
                Note: null,
                OriginalGuidString: null,
                PK: -1,
                QueryDataRightCode: null,
                ScriptType: null,
                SoftSystemCode: "GOS",
                SqlName: '',
                SqlScripe: '',
                TableDisplayerGuid: null,
                Tag: null,
                Version: 5,
                VersionNum: 4,
                WorkFlowGuid: "",
                WorkFlowState: "",
            },
            panel2: [],
            keys: 0,//Tab得选中
        }
    }
    componentWillMount() {
        uuid = 0
        const { TableValue, disabled } = this.props
        this.setState({
            submitData: TableValue,
            disabled: disabled,
            counts: TableValue.QueryExtend.length
        }, () => {
            // console.log(this.state.submitData)
            // console.log(this.state.disabled)
        })
    }
    componentWillReceiveProps(pre) {
        // console.log(pre)
        const TableValue = pre.TableValue
        const disabled = pre.disabled
        uuid = 0
        this.setState({
            submitData: TableValue,
            disabled: disabled,
            counts: TableValue.QueryExtend.length
        }, () => {
            // console.log(this.state.submitData)
            // console.log(this.state.disabled)
        })
    }
    //提交
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            // this.setState({
            //     loading: true
            // })
            if (!err) {
                let sub = JSON.parse(JSON.stringify(this.props.clear))
                let QueryExtendOri = sub.QueryExtend//源数据  新建得则没有为空数组
                let QueryExtendNew = values.QueryExtends //新数据  创建得直接加在Ori后面
                const { DQuerySql, QueryExtend } = this.state
                let DQuerySqlState = JSON.parse(JSON.stringify(DQuerySql))
                let QueryExtendState = JSON.parse(JSON.stringify(QueryExtend))
                if (this.BookOpen.length > 0) {
                    // console.log(this.BookData)
                    //使用过book
                    let num = []
                    this.BookOpen.forEach(e => {
                        //获取到那几个位置得使用book修改过
                        num.push(Number(e.substring(0, 1)))
                    })
                    // console.log(num)
                    QueryExtendNew.forEach((e, index) => {
                        let DQuerySqlNew = {}
                        let flag = false
                        num.forEach(key => {
                            if (key === index) {
                                flag = true
                            }
                        });
                        // console.log(flag)
                        flag ? DQuerySqlNew = this.BookData[index] : DQuerySqlNew = Object.assign(DQuerySqlState, e.DQuerySql)
                        Object.assign(QueryExtendState, e)
                        // console.log(DQuerySqlNew)
                        QueryExtendState.DQuerySql = DQuerySqlNew
                        QueryExtendOri.push(QueryExtendState)
                    })
                } else {
                    QueryExtendNew.forEach(e => {
                        let DQuerySqlNew = Object.assign(DQuerySqlState, e.DQuerySql)
                        Object.assign(QueryExtendState, e)
                        QueryExtendState.DQuerySql = DQuerySqlNew
                        QueryExtendOri.push(QueryExtendState)
                    })
                }
                let setting = JSON.stringify(values.Settings)
                Object.assign(sub, values.Data)
                sub.QueryExtend = QueryExtendOri
                sub.Settings = setting
                console.log('Received values of form: ', sub);
                postFetch(Save().Simple, sub, (res) => {
                    if (res.IsSuccess === 'True') {
                        this.setState({
                            disabledCopy: false,
                            disabled: true,
                            loading: false
                        }, () => {
                            notification.success({
                                message: '提示',
                                description: '可以执行同步',
                                key: '1',
                                btn: <ButtonGroup>
                                    <Button onClick={() => { this.asyncData(res.SqlList) }} size='small'>同步</Button>
                                    <Button onClick={this.ActiveTable.bind(this)} size='small'>取消</Button>
                                </ButtonGroup>
                            })
                        })
                    } else {
                        this.setState({
                            loading: false
                        })
                        notification.warning({
                            message: '警告',
                            description: '保存失败' + res.ErrMessage
                        })
                    }
                })
            }
        });
    }
    ActiveTable = () => {
        this.props.ActiveKey()
        notification.close('1')
    }
    //刷新
    handleReset = () => {
        this.props.form.resetFields();
    }

    asyncData = (value) => {
        let path = {
            pathname: '/Home/AsyncData',
            state: value
        }
        notification.close('1')
        this.props.history.push(path)
    }
    callback = (key) => {
        // console.log(key);
    }
    //点击打开表格查询
    handleBook = (value) => {
        const { setFieldsValue } = this.props.form
        console.log(value)
        const keys = this.state.keys
        console.log(keys)
        let num = keys.substring(0, 1)
        let obj = {}
        let arr = ['SqlName', 'SqlScripe']
        arr.forEach(element => {
            obj[`QueryExtends[${num}].DQuerySql.${element}`] = value[element]
        });
        console.log(obj)
        setFieldsValue(obj)
        //大于0 表示添加过 就要判断 
        let flage = -1
        if (this.BookOpen.length > 0) {
            this.BookOpen.forEach((e, i) => {
                if (e === keys) {
                    flage = i//创建过再次编辑  就记录位置  修改
                }
            })
            if (flage !== -1) {
                //有记录 就替换
                this.BookOpen[flage] = keys
                this.BookData[flage] = value
            } else {
                //没有记录 就增加
                this.BookOpen.push(keys)
                this.BookData.push(value)
            }
        } else {
            //没有创建 就增加
            this.BookOpen.push(keys)
            this.BookData.push(value)
        }
    }

    //添加Tab
    addTabs = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    //删除Tab
    delTabs = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    //监听TAB
    TabsChange = (key) => {
        console.log(key)
        this.setState({
            keys: key
        })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        // console.log(this.props.form)
        const { disabled, loading, counts } = this.state
        // console.log(TableValue)
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
        const switchLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        };
        const formItemLayoutTab = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        // console.log(submitData)
        const Options = []
        OptionValue.forEach((element) => {
            Options.push(
                <Option key={element} value={element}>{element}</Option>
            )
        });
        const OptionsLay = []
        OptionsLayValue.forEach((ele) => {
            OptionsLay.push(
                <Option key={ele + 'lay'} value={ele}>{ele}</Option>
            )
        })
        //侧边的
        const Fun = []
        const Servers = []
        const Menu = []
        MenuAdmin.map((v, index) => {
            // console.log(v)
            const n = 'Settings.' + v.Code
            return Menu.push(
                <FormItem label={v.Name} {...switchLayout} key={`${index}Menu`}>
                    {getFieldDecorator(n, { valuePropName: 'checked' })(
                        <Switch disabled={disabled} />
                    )}
                </FormItem>
            )
        })
        ServerAdmin.map((v, index) => {
            const n = 'Settings.' + v.Code
            // console.log(v)
            return Servers.push(
                <FormItem label={v.Name} {...switchLayout} key={`${index}Menu`}>
                    {getFieldDecorator(n, { valuePropName: 'checked' })(
                        <Switch disabled={disabled} />
                    )}
                </FormItem>
            )
        })
        FunAdmin.map((v, index) => {
            const n = 'Settings.' + v.Code
            // console.log(v)
            return Fun.push(
                <FormItem label={v.Name} {...switchLayout} key={`${index}Menu`}>
                    {getFieldDecorator(n, { valuePropName: 'checked' })(
                        <Switch disabled={disabled} />
                    )}
                </FormItem>
            )
        })
        const panel = []
        for (let l = 0; l < counts; l++) {
            // console.log(counts)
            panel.push(
                <TabPane key={l + 'QueryExtend'} tab='Tab'>
                    <FormItem
                        {...formItemLayoutTab}
                        label="页签名称"
                    >
                        {getFieldDecorator(`QueryExtend[${l}].DQueryCaption`, {
                            rules: [{ required: true, message: 'Please input 页签名称!' }],
                        })(
                            <Input disabled={true} autoComplete="off" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutTab}
                        label="SQL名"
                    >
                        {getFieldDecorator(`QueryExtend[${l}].DQuerySql.SqlName`, {
                            rules: [{ required: true, message: 'Please input SQL名!' }],
                        })(
                            <Input disabled={true} autoComplete="off"
                                addonAfter={
                                    <SimpleBtn handleBook={this.handleBook.bind(this)}></SimpleBtn>
                                } />
                        )}
                    </FormItem>
                    <Col span={12}>
                        <FormItem label='是否分页' {...switchLayout}>
                            {getFieldDecorator(`QueryExtend[${l}].IsPaging`)(
                                <Select
                                    style={Widths}
                                    disabled={true}>
                                    <Option value={0}>是</Option>
                                    <Option value={1}>否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='是否使用缓存服务器' {...switchLayout}>
                            {getFieldDecorator(`QueryExtend[${l}].IsUseCacheServer`)(
                                <Select
                                    style={Widths}
                                    disabled={true}>
                                    <Option value={0}>是</Option>
                                    <Option value={1}>否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <FormItem
                        {...formItemLayoutTab}
                        label="数据来源"
                    >
                        {getFieldDecorator(`QueryExtend[${l}].DataSource`, {
                            rules: [{ required: true, message: 'Please input 数据来源!' }],
                        })(
                            <Select
                                style={Widths}
                                disabled={true}>
                                <Option value={0}>集中服务器</Option>
                                <Option value={1}>分公司服务器</Option>
                                <Option value={2}>SOLR</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutTab}
                        label="SQL内容"
                    >
                        {getFieldDecorator(`QueryExtend[${l}].DQuerySql.SqlScripe`, {
                            rules: [{ required: true, message: 'Please input SQL内容!' }],
                        })(
                            <TextArea disabled={true} autoComplete="off" rows={10} cols={20}
                                style={{ resize: 'none' }} />
                        )}
                    </FormItem>
                </TabPane>
            )
        }
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        // console.log(keys)
        const formItems = keys.map((k, index) => {
            return (
                <TabPane key={index + 'QueryExtends'} tab='Tab'>
                    <FormItem
                        {...formItemLayoutTab}
                        label="页签名称"
                    >
                        {getFieldDecorator(`QueryExtends[${index}].DQueryCaption`, {
                            rules: [{ required: true, message: 'Please input 页签名称!' }],
                        })(
                            <Input disabled={disabled} autoComplete="off" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutTab}
                        label="SQL名"
                    >
                        {getFieldDecorator(`QueryExtends[${index}].DQuerySql.SqlName`, {
                            rules: [{ required: true, message: 'Please input SQL名!' }],
                        })(
                            <Input disabled={disabled} autoComplete="off"
                                addonAfter={
                                    <SimpleBtn handleBook={this.handleBook.bind(this)}></SimpleBtn>
                                } />
                        )}
                    </FormItem>
                    <FormItem label='是否分页' {...formItemLayoutTab}>
                        {getFieldDecorator(`QueryExtends[${index}].IsPaging`, {
                            initialValue: 0
                        })(
                            <Select
                                style={Widths}
                                disabled={disabled}>
                                <Option value={0}>是</Option>
                                <Option value={1}>否</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label='是否使用缓存服务器' {...formItemLayoutTab}>
                        {getFieldDecorator(`QueryExtends[${index}].IsUseCacheServer`, {
                            initialValue: 0
                        })(
                            <Select
                                style={Widths}
                                disabled={disabled}>
                                <Option value={0}>是</Option>
                                <Option value={1}>否</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutTab}
                        label="数据来源"
                    >
                        {getFieldDecorator(`QueryExtends[${index}].DataSource`, {
                            initialValue: 0,
                            rules: [{ required: true, message: 'Please input 数据来源!' }],
                        })(
                            <Select
                                style={Widths}
                                disabled={disabled}>
                                <Option value={0}>集中服务器</Option>
                                <Option value={1}>分公司服务器</Option>
                                <Option value={2}>SOLR</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayoutTab}
                        label="SQL内容"
                    >
                        {getFieldDecorator(`QueryExtends[${index}].DQuerySql.SqlScripe`, {
                            rules: [{ required: true, message: 'Please input SQL内容!' }],
                        })(
                            <TextArea disabled={disabled} autoComplete="off" rows={10} cols={20}
                                style={{ resize: 'none' }} />
                        )}
                    </FormItem>
                </TabPane>
            );
        });
        return (
            <Form onSubmit={this.handleSubmit}>
                <Spin spinning={loading}>
                    <Card extra={
                        <ButtonGroup>
                            <Button type="primary" htmlType="submit" disabled={disabled}>确定</Button>
                            <Button type='danger' htmlType='button' disabled={disabled} onClick={this.handleReset}>重置</Button>
                        </ButtonGroup>}>
                        <Row gutter={2}>
                            <Col span={18}>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="查询表示"
                                    >
                                        {getFieldDecorator('Data.BillTypeCode', {
                                            rules: [{ required: true, message: 'Please input 查询表示!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="条件控制程序集"
                                    >
                                        {getFieldDecorator('Data.DQueryParamAssembly', {
                                            rules: [{ required: true, message: 'Please input 条件控制程序集!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="主控件程序集"
                                    >
                                        {getFieldDecorator('Data.DQueryMasterAssembly', {
                                            rules: [{ required: true, message: 'Please input 主控件程序集!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="从控件程序集"
                                    >
                                        {getFieldDecorator('Data.DQuerySlaveAssembly', {
                                            rules: [{ required: true, message: 'Please input 从控件程序集!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="所属模块"
                                    >
                                        {getFieldDecorator('Data.Module', {
                                            rules: [{ required: true, message: 'Please input 所属模块!' }],
                                        })(
                                            <Select disabled={disabled}>
                                                {Options}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="作者"
                                    >
                                        {getFieldDecorator('Data.Author', {
                                            rules: [{ required: true, message: 'Please input 作者!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="窗口名称"
                                    >
                                        {getFieldDecorator('Data.DQueryCaption', {
                                            rules: [{ required: true, message: 'Please input 窗口名称!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="条件控制命名"
                                    >
                                        {getFieldDecorator('Data.DQueryParamFullName', {
                                            rules: [{ required: true, message: 'Please input 条件控制命名!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="主控件命名"
                                    >
                                        {getFieldDecorator('Data.DQueryMasterFullName', {
                                            rules: [{ required: true, message: 'Please input 主控件命名!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="从控件命名"
                                    >
                                        {getFieldDecorator('Data.DQuerySlaveFullName', {
                                            rules: [{ required: true, message: 'Please input 从控件命名!' }],
                                        })(
                                            <Input disabled={disabled} autoComplete="off" />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="窗口布局"
                                    >
                                        {getFieldDecorator('Data.LayoutMode', {
                                            rules: [{ required: true, message: 'Please input 窗口布局!' }],
                                        })(
                                            <Select disabled={disabled}>
                                                {OptionsLay}
                                            </Select>
                                        )}
                                    </FormItem>
                                    <FormItem label="打开设计" {...formItemLayout}>
                                        <Select disabled defaultValue={0}>
                                            <Option value={0}>代码设计器</Option>
                                            <Option value={1}>XML设计器</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <Tabs defaultActiveKey='0QueryExtend'
                                        onChange={this.TabsChange.bind(this)}
                                        tabBarExtraContent={
                                            <div>
                                                <Button onClick={this.addTabs.bind(this)}>添加</Button>
                                                <Button onClick={this.delTabs.bind(this)}>删除</Button>
                                            </div>
                                        }>
                                        {panel}
                                        {formItems}
                                    </Tabs>
                                </Col>
                            </Col>
                            <Col span={6}>
                                <Collapse
                                    defaultActiveKey={['1', '2', '3']}
                                    onChange={this.callback.bind(this)}
                                    bordered={false}>
                                    <Panel header="功能控制" key="1">
                                        {Fun}
                                    </Panel>
                                    <Panel header="系统控制" key="2">
                                        {Servers}
                                    </Panel>
                                    <Panel header="菜单控制" key="3">
                                        {Menu}
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </Card>
                </Spin>
            </Form>
        );
    }
}

const simpleActions = Form.create({
    mapPropsToFields(props) {
        // console.log(1)
        const { TableValue } = props
        // console.log(TableValue)
        let Field = {}
        FormList.forEach(element => {
            switch (element) {
                case 'Settings':
                    let Values = JSON.parse(TableValue.Settings)
                    SettingsOri.forEach(e => {
                        const n = 'Settings.' + e
                        Field[n] = Form.createFormField({ value: Values[e] === 'true' ? true : false })
                    });
                    break;
                case 'QueryExtend':
                    let QueryExtend = TableValue.QueryExtend
                    QueryExtend.forEach((element, index) => {
                        FormListQuery.forEach(value => {
                            switch (value) {
                                case 'DQuerySql.SqlScripe':
                                    Field[`QueryExtend[${index}].${value}`] = Form.createFormField({ value: element['DQuerySql']['SqlScripe'] })
                                    break;
                                case 'DQuerySql.SqlName':
                                    Field[`QueryExtend[${index}].${value}`] = Form.createFormField({ value: element['DQuerySql']['SqlName'] })
                                    break;
                                default:
                                    Field[`QueryExtend[${index}].${value}`] = Form.createFormField({ value: element[value] })
                                    break;
                            }
                        });
                    });
                    break;
                default:
                    Field[`Data.${element}`] = Form.createFormField({ value: TableValue[element] })
                    break;
            }
        });
        // Field.TableValue = TableValue
        console.log(Field)
        return Field
    }
})(RegistrationForm);

export default simpleActions