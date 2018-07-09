import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Link, Route } from 'react-router-dom'
import Action from '../Action/Action';
import Windows from '../Windows/Windows_'
import Simple from '../Simple/Simple';
import PVComponent from '../../Logrecord/PVComponent';
import TimeComponent from '../../Logrecord/TimeComponent'
import Errorlog from '../../Logrecord/Errorlog'
import AcerageComponent from "../../Logrecord/AverageComponent.jsx";
import Bill from '../../Component/Bill/Bill'
import AsyncData from '../../Builds/AsyncData';
import PopWindows from '../PopWindows/PopWindows';
import Test from '../../TestModule/Test';
import SQLManage from '../SQLManage/SQLManage';
import TableUpdate from '../../Builds/TableUpdate'
const { Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Home extends React.Component {
    state = {
        collapsed: false,
        name: ''
    };
    componentWillMount() {
        let values = this.props.location.state
        if (values === undefined) {
            this.props.history.push('/')
        } else {
            values = JSON.stringify(values.userName).replace(/\"/g, '')
            console.log(values)
            this.setState({
                name: values
            })
        }
    }
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span>Option 1</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop" />
                            <span>Option 2</span>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="user" /><span>配置</span></span>}
                        >
                            <Menu.Item key="3"><Link to='/Home/Action'>菜单管理</Link></Menu.Item>
                            <Menu.Item key="4"><Link to='/Home/Windows'>窗体行为编辑</Link></Menu.Item>
                            <Menu.Item key="5"><Link to='/Home/Simple'>简单通用查询</Link></Menu.Item>
                            <Menu.Item key="6"><Link to='/Home/Bill'>单据定义</Link></Menu.Item>
                            <Menu.Item key="61"><Link to='/Home/PopWindows'>弹出选择窗口管理</Link></Menu.Item>
                            <Menu.Item key="SQL"><Link to='/Home/SQLManage'>SQL语句管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={<span><Icon type="team" /><span>发布与构建</span></span>}
                        >
                            <Menu.Item key="111"><Link to='/Home/AsyncData'>数据同步</Link></Menu.Item>
                            <Menu.Item key="71"><Link to={'/Home/TableUpdate/' + this.state.name}>表结构更新管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={<span><Icon type="team" /><span>日志查询</span></span>}
                        >
                            <Menu.Item key="8"><Link to='/Home/PVComponent'>按条件分组</Link></Menu.Item>
                            <Menu.Item key="9"><Link to='/Home/TimeComponent'>按时段分组</Link></Menu.Item>
                            <Menu.Item key='10'><Link to='/Home/AcerageComponent'>平均耗时统计</Link></Menu.Item>
                            <Menu.Item key="11"><Link to="/Home/Errorlog">错误日志</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={<span><Icon type="team" /><span>测试</span></span>}
                        >
                            <Menu.Item key="Test"><Link to='/Home/Test'>自动化测试</Link></Menu.Item>
                            <Menu.Item key="711">Team 2</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: '0 10px' }}>
                        <Breadcrumb style={{ margin: '10px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 5, background: '#fff', minHeight: 560 }}>
                            <Route path='/Home/Action' component={Action}></Route>
                            <Route path='/Home/Windows' component={Windows}></Route>
                            <Route path='/Home/Simple' component={Simple}></Route>
                            <Route path='/Home/PVComponent' component={PVComponent}></Route>
                            <Route path='/Home/TimeComponent' component={TimeComponent}></Route>
                            <Route path="/Home/Errorlog" component={Errorlog}></Route>
                            <Route path='/Home/AcerageComponent' component={AcerageComponent}></Route>
                            <Route path='/Home/Bill' component={Bill}></Route>
                            <Route path='/Home/AsyncData' component={AsyncData}></Route>
                            <Route path='/Home/PopWindows' component={PopWindows}></Route>
                            <Route path='/Home/Test' component={Test}></Route>
                            <Route path='/Home/SQLManage' component={SQLManage}></Route>
                            <Route path='/Home/TableUpdate/:id' component={TableUpdate}></Route>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: 10 }}>
                        DEV Design ©2018 Created by L UED
          </Footer>
                </Layout>
            </Layout >
        );
    }
}

export default Home