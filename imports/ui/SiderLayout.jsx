import React from "react";
import * as antd from "antd";
const { Layout, Menu, Icon } = antd;
const { Header, Content, Footer, Sider } = Layout;
import "antd/dist/antd.css";

import DailyLimitChart from "./webapp/DailyLimitChart";
import DynamicStatement from "./webapp/DynamicStatement";

const SubMenu = Menu.SubMenu;

export default class SiderLayout extends React.Component {
    contentConfig = {
        // "1": <DailyLimitChart />,
        "2": <DynamicStatement />
    };
    state = {
        curKey: "2"
    };

    onClickMenu = e => {
        const { key } = e;
        this.setState({ curKey: key });
    };

    renderContent = key => {
        return this.contentConfig[key];
    };
    render() {
        return (
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    style={{
                        overflow: "auto",
                        height: "100vh",
                        position: "fixed"
                    }}
                >
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={["2"]}
                        mode="inline"
                        onClick={this.onClickMenu}
                    >
                        {/* <Menu.Item key="1">
                            <Icon type="line-chart" />
                            <span>昨日涨停指数</span>
                        </Menu.Item> */}
                        <Menu.Item key="2">
                            <Icon type="line-chart" />
                            <span>动态语句查询</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    {/* <Header style={{ background: "#fff", padding: 0 }} /> */}
                    <Content style={{ margin: "0 16px" }}>
                        <div
                            style={{
                                padding: 24,
                                background: "#fff",
                                minHeight: 360,
                                height: "100%"
                            }}
                        >
                            {this.renderContent(this.state.curKey)}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
