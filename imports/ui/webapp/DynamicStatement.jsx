import React from "react";
import "antd/dist/antd.css";
import { Anchor, Table, Menu, Layout } from "antd";
const { Sider } = Layout;

import { withTracker } from "meteor/react-meteor-data";
import { Helper } from "./helper";
import {
    QueryAttack,
    QueryBid,
    QueryDoubleBid,
    QueryWeakToStrong,
    QueryTodayTop,
    QueryDLToday,
    QueryFirstDL,
    QueryContinueDL,
    QueryDoubleDL,
    QueryTripleDL,
    QueryTriplePlusDL,
    QueryDLAndFried,
    QueryDLBeforeToday,
    QueryDownLimitToday,
    QueryDLY,
    QueryFirstDLY,
    QueryContinueDLY,
    QueryDoubleDLY,
    QueryTripleDLY,
    QueryTriplePlusDLY,
    QueryGainOverFive,
    QueryDeclineOverFive
} from "../../api/dynamicQuery";

const { Link } = Anchor;
class DynamicStatement extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        curKey: "queryAttack"
    };
    renderDailyLimit() {}

    componentDidMount() {}

    onClickMenu = e => {
        const { key } = e;
        this.setState({ curKey: key });
    };

    getMenuItems = () => {
        return Object.keys(queryObj).map((key, index) => {
            return (
                <Menu.Item key={key}>
                    <span>{queryObj[key].title}</span>
                </Menu.Item>
            );
        });
    };

    getTables = (key = "queryAttack") => {
        const { dealData, queryStr, DLCol, title } = queryObj[key];

        if (this.props[key].length <= 0) {
            return (
                <div id={key} key={"table-" + key}>
                    <div
                        style={{ fontSize: 20, color: "red" }}
                        className="anchor"
                    >
                        {title}(0)
                    </div>
                    <div>最后更新时间:</div>
                    <div>查询语句: {queryStr}</div>
                    <Table
                        key={"table" + key}
                        columns={DLCol ? DLColumns : columns}
                        dataSource={[]}
                        scroll={{ x: window.innerWidth - 400, y: 600 }}
                        pagination={{ pageSize: 0 }}
                    />
                </div>
            );
        } else {
            const {
                lastUpdateAt,
                result,
                title,
                lastUpdateInterval
            } = this.props[key][0];

            const data = dealData(result);
            return (
                <div id={key} key={"table-" + key}>
                    <div
                        style={{ fontSize: 20, color: "red" }}
                        className="anchor"
                    >
                        {title}({data.length})
                    </div>
                    <div>
                        最后更新时间:
                        {Helper.formatDate(
                            "yyyy-MM-dd hh:mm:ss",
                            new Date(lastUpdateAt)
                        )}
                    </div>
                    <div className="red">
                        上一次更新时间间隔:
                        {~~(lastUpdateInterval / 1000) + "s"}
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        查询语句: {queryStr}
                    </div>
                    <Table
                        key={"table" + key}
                        columns={DLCol ? DLColumns : columns}
                        dataSource={data}
                        scroll={{ x: window.innerWidth - 400, y: 600 }}
                        pagination={{ pageSize: data.length }}
                    />
                </div>
            );
        }
    };
    render() {
        return (
            <>
                <div id="dynamicLayout" style={{ position: "absolute" }}>
                    <Layout style={{ minHeight: "100vh" }}>
                        <Sider
                            style={{
                                overflow: "auto",
                                height: "100vh",
                                position: "fixed",
                                maxWidth: "120px",
                                minWidth: "120px",
                                width: "120px"
                            }}
                        >
                            <Menu
                                theme="white"
                                defaultSelectedKeys={["1"]}
                                mode="inline"
                                onClick={this.onClickMenu}
                            >
                                {this.getMenuItems()}
                            </Menu>
                        </Sider>
                    </Layout>
                </div>

                <div style={{ marginLeft: "150px" }}>
                    {this.getTables(this.state.curKey)}
                </div>
            </>
        );
    }
}
export default withTracker(() => {
    const now = new Date();
    const todayDate =
        now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const result = {};
    Object.keys(queryObj).forEach(key => {
        Meteor.subscribe(key);

        result[key] = queryObj[key].db
            .find({
                date: todayDate
            })
            .fetch();
    });

    Meteor.subscribe("queryAttack");
    return result;
})(DynamicStatement);

const columns = [
    {
        align: "center",
        title: "股票代码",
        width: 100,
        dataIndex: "id",
        key: "id",
        fixed: "left"
    },
    {
        align: "center",
        title: "股票名称",
        width: 100,
        dataIndex: "name",
        key: "name",
        fixed: "left"
    },
    {
        title: "现价",
        dataIndex: "curPrice",
        align: "center",
        className: "red",
        key: "curPrice",
        width: 80
    },
    {
        title: "涨幅",
        dataIndex: "rise",
        align: "center",
        key: "rise",
        width: 100,
        sorter: (a, b) => a.rise * 1 - b.rise * 1,
        render: text => (
            <span style={{ color: text * 1 > 0 ? "#FF0000" : "#00FF00" }}>
                {text.toFixed(2) + "%"}
            </span>
        )
    },
    {
        title: "9.25分时量比",
        dataIndex: "bidVol",
        align: "center",
        key: "bidVol",
        width: 130,
        render: text => <span>{(text * 1).toFixed(2) + "%"}</span>
    },
    {
        title: "竞价金额",
        dataIndex: "bidCount",
        align: "center",
        key: "bidCount",
        width: 100,
        render: text => <span>{text + "万"}</span>
    },
    {
        title: "9.25涨跌",
        dataIndex: "bidRize",
        align: "center",
        key: "bidRize",
        width: 100,
        render: text => <span>{(text * 1).toFixed(2) + "%"}</span>
    },
    {
        title: "最新量能",
        dataIndex: "dayVol",
        align: "center",
        key: "dayVol",
        width: 100,
        render: text => <span>{text + "万"}</span>
    },
    {
        title: "换手率",
        dataIndex: "changeRate",
        align: "center",
        key: "changeRate",
        width: 100,
        render: text => <span>{text + "%"}</span>
    },
    {
        title: "当日涨停原因",
        dataIndex: "DLReason",
        align: "center",
        width: 200,
        key: "DLReason"
    },
    {
        title: "昨日涨停原因",
        dataIndex: "DLYReason",
        align: "center",
        width: 200,
        key: "DLYReason"
    },
    {
        title: "连续涨停天数",
        dataIndex: "DLDaysCount",
        align: "center",
        width: 150,
        key: "DLDaysCount"
    },
    {
        title: "所属概念",
        dataIndex: "concept",
        align: "center",
        width: 200,
        key: "concept",
        className: "concept",
        render: text => <span title={text}>{text}</span>
    }
];
const DLColumns = [
    {
        align: "center",
        title: "股票代码",
        width: 100,
        dataIndex: "id",
        key: "id",
        fixed: "left"
    },
    {
        align: "center",
        title: "股票名称",
        width: 100,
        dataIndex: "name",
        key: "name",
        fixed: "left"
    },
    {
        title: "首次涨停时间",
        dataIndex: "firstDLTime",
        align: "center",
        width: 150,
        key: "firstDLTime",
        sorter: (a, b) => a.firstDLTime * 1 - b.firstDLTime * 1,
        render: text => {
            return (
                <span className="red">
                    {Helper.formatDate("hh:mm:ss", new Date(text))}
                </span>
            );
        }
    },
    {
        title: "最终涨停时间",
        dataIndex: "finalDLTime",
        align: "center",
        width: 150,
        key: "finalDLTime",
        sorter: (a, b) => a.finalDLTime * 1 - b.finalDLTime * 1,
        render: text => (
            <span className="red">
                {Helper.formatDate("hh:mm:ss", new Date(text))}
            </span>
        )
    },
    {
        title: "现价",
        dataIndex: "curPrice",
        align: "center",
        className: "red",
        key: "curPrice",
        width: 80
    },
    {
        title: "涨幅",
        dataIndex: "rise",
        align: "center",
        key: "rise",
        width: 100,
        sorter: (a, b) => a.rise * 1 - b.rise * 1,
        render: text => (
            <span style={{ color: text * 1 > 0 ? "#FF0000" : "#00FF00" }}>
                {text.toFixed(2) + "%"}
            </span>
        )
    },
    {
        title: "9.25分时量比",
        dataIndex: "bidVol",
        align: "center",
        key: "bidVol",
        width: 130,
        render: text => <span>{(text * 1).toFixed(2) + "%"}</span>
    },
    {
        title: "竞价金额",
        dataIndex: "bidCount",
        align: "center",
        key: "bidCount",
        width: 100,
        render: text => <span>{text + "万"}</span>
    },
    {
        title: "9.25涨跌",
        dataIndex: "bidRize",
        align: "center",
        key: "bidRize",
        width: 100,
        render: text => <span>{(text * 1).toFixed(2) + "%"}</span>
    },
    {
        title: "最新量能",
        dataIndex: "dayVol",
        align: "center",
        key: "dayVol",
        width: 100,
        render: text => <span>{text + "万"}</span>
    },
    {
        title: "换手率",
        dataIndex: "changeRate",
        align: "center",
        key: "changeRate",
        width: 100,
        render: text => <span>{text + "%"}</span>
    },
    {
        title: "当日涨停原因",
        dataIndex: "DLReason",
        align: "center",
        width: 200,
        key: "DLReason"
    },
    {
        title: "昨日涨停原因",
        dataIndex: "DLYReason",
        align: "center",
        width: 200,
        key: "DLYReason"
    },
    {
        title: "连续涨停天数",
        dataIndex: "DLDaysCount",
        align: "center",
        width: 150,
        key: "DLDaysCount"
    },
    {
        title: "所属概念",
        dataIndex: "concept",
        align: "center",
        width: 200,
        key: "concept",
        className: "concept",
        render: text => <span title={text}>{text}</span>
    }
];

const queryObj = {
    queryAttack: {
        db: QueryAttack,
        title: "攻击监控",
        queryStr: `竞价金额大于1000万；现价>今日开盘价,股价涨幅大于3%,今日最高价>昨日收盘价*1.07,现价>分时均价；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2][0],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryBid: {
        db: QueryBid,
        title: "竞价监控",
        queryStr: `竞价金额大于1000万，竞价涨幅大于0.1%，昨日涨幅1%以上；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3][0] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDoubleBid: {
        db: QueryDoubleBid,
        title: "竞价倍量",
        queryStr: `今日竞价金额大于2000万,今日竞价金额>昨日竞价金额*3,股价涨幅大于0.1%,昨日涨幅5%以上；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3][0] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5][0] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryWeakToStrong: {
        db: QueryWeakToStrong,
        title: "弱转强监控",
        queryStr: `前一个交易日最高价=涨停价,今日高开,竞价金额大于900万；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryTodayTop: {
        db: QueryTodayTop,
        title: "当日前排",
        queryStr: `9点40分收盘价=9点40分涨停价；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDLToday: {
        db: QueryDLToday,
        title: "当日涨停",
        queryStr: `今日涨停,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[16],
                    rise: item[15] * 1,
                    bidVol: ~~(item[14] * 100) / 100,
                    bidCount: ~~(item[13] / 10000),
                    bidRize: ~~(item[12] * 100) / 100,
                    dayVol: ~~(item[11] / 10000),
                    changeRate: ~~item[10],
                    DLDaysCount: item[9],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryFirstDL: {
        db: QueryFirstDL,
        title: "首板涨停",
        queryStr: `连续涨停次数为1,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[15],
                    rise: item[14] * 1,
                    bidVol: ~~(item[13] * 100) / 100,
                    bidCount: ~~(item[12] / 10000),
                    bidRize: ~~(item[11] * 100) / 100,
                    dayVol: ~~(item[10] / 10000),
                    changeRate: ~~item[9],
                    DLDaysCount: item[4],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryContinueDL: {
        db: QueryContinueDL,
        title: "连板股",
        queryStr: `连续涨停次数大于等于2,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[15],
                    rise: item[14] * 1,
                    bidVol: ~~(item[13] * 100) / 100,
                    bidCount: ~~(item[12] / 10000),
                    bidRize: ~~(item[11] * 100) / 100,
                    dayVol: ~~(item[10] / 10000),
                    changeRate: ~~item[9],
                    DLDaysCount: item[4],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryDoubleDL: {
        db: QueryDoubleDL,
        title: "二连板",
        queryStr: `连续涨停次数等于2,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[15],
                    rise: item[14] * 1,
                    bidVol: ~~(item[13] * 100) / 100,
                    bidCount: ~~(item[12] / 10000),
                    bidRize: ~~(item[11] * 100) / 100,
                    dayVol: ~~(item[10] / 10000),
                    changeRate: ~~item[9],
                    DLDaysCount: item[4],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryTripleDL: {
        db: QueryTripleDL,
        title: "三连板",
        queryStr: `连续涨停次数等于3,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[15],
                    rise: item[14] * 1,
                    bidVol: ~~(item[13] * 100) / 100,
                    bidCount: ~~(item[12] / 10000),
                    bidRize: ~~(item[11] * 100) / 100,
                    dayVol: ~~(item[10] / 10000),
                    changeRate: ~~item[9],
                    DLDaysCount: item[4],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryTriplePlusDL: {
        db: QueryTriplePlusDL,
        title: "三连板+",
        queryStr: `连续涨停次数大于等于3,首次涨停时间从小到大排名；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[2] * 1,
                    finalDLTime: item[5] * 1,
                    curPrice: item[15],
                    rise: item[14] * 1,
                    bidVol: ~~(item[13] * 100) / 100,
                    bidCount: ~~(item[12] / 10000),
                    bidRize: ~~(item[11] * 100) / 100,
                    dayVol: ~~(item[10] / 10000),
                    changeRate: ~~item[9],
                    DLDaysCount: item[4],
                    DLReason: item[8][0],
                    DLYReason: item[8][1],
                    concept: item[7]
                });
            });
            return finalData;
        }
    },
    queryDLAndFried: {
        db: QueryDLAndFried,
        title: "连板炸板",
        queryStr: `前一个交易日连续涨停天数大于等于1，今日最高价等于涨停价，收盘价低于涨停价；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[14] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDLBeforeToday: {
        db: QueryDLBeforeToday,
        title: "今曾涨停",
        queryStr: `今日最高价等于涨停价，现价低于涨停价；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[14] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDownLimitToday: {
        db: QueryDownLimitToday,
        title: "当日跌停",
        queryStr: `当日跌停；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDLY: {
        db: QueryDLY,
        title: "昨日涨停",
        queryStr: `前一个交易日涨停；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[17] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryFirstDLY: {
        db: QueryFirstDLY,
        title: "昨日首板",
        queryStr: `昨日连续涨停天数等于1；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[16] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryContinueDLY: {
        db: QueryContinueDLY,
        title: "昨日连板",
        queryStr: `昨日连续涨停天数大于1；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[16] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDoubleDLY: {
        db: QueryDoubleDLY,
        title: "昨日二连板",
        queryStr: `涨停时间,昨日连续涨停天数等于2；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[16] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryTripleDLY: {
        db: QueryTripleDLY,
        title: "昨日三连板",
        queryStr: `昨日连续涨停天数等于3；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[16] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryTriplePlusDLY: {
        db: QueryTriplePlusDLY,
        title: "昨日三连板+",
        queryStr: `昨日连续涨停天数大于等于3；`,
        DLCol: true,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    firstDLTime: item[13] * 1,
                    finalDLTime: item[16] * 1,
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9][0],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryGainOverFive: {
        db: QueryGainOverFive,
        title: "大于5%涨幅",
        queryStr: `今日涨幅大于5%；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    },
    queryDeclineOverFive: {
        db: QueryDeclineOverFive,
        title: "大于5%跌幅",
        queryStr: `今日跌幅大于5%；`,
        dealData: function(arr) {
            const finalData = [];
            arr.forEach((item, index) => {
                finalData.push({
                    key: index,
                    id: item[0],
                    name: item[1],
                    curPrice: item[2],
                    rise: item[3] * 1,
                    bidVol: ~~(item[4] * 100) / 100,
                    bidCount: ~~(item[5] / 10000),
                    bidRize: ~~(item[6] * 100) / 100,
                    dayVol: ~~(item[7] / 10000),
                    changeRate: ~~item[8],
                    DLDaysCount: item[9],
                    DLReason: item[10][0],
                    DLYReason: item[10][1],
                    concept: item[11]
                });
            });
            return finalData;
        }
    }
};
