import React from "react";
import "antd/dist/antd.css";
import { Anchor, Table } from "antd";

const { Link } = Anchor;
export default class DynamicStatement extends React.Component {
    getLinks = () => {
        return Object.keys(queryObj).map((key, index) => {
            return (
                <Link
                    key={"link" + index}
                    href={"#" + key}
                    title={queryObj[key].title}
                />
            );
        });
    };

    getTables = () => {
        return Object.keys(queryObj).map((key, index) => {
            return (
                <div id={key} key={"table" + index}>
                    <span
                        style={{ fontSize: 20, color: "red" }}
                        className="anchor"
                    >
                        {queryObj[key].title}
                    </span>
                    <Table
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: window.innerWidth - 400, y: 600 }}
                        pagination={{ pageSize: data.length }}
                    />
                </div>
            );
        });
    };
    render() {
        return (
            <>
                <div style={{ position: "absolute" }}>
                    <Anchor style={{ width: "150px" }}>
                        {this.getLinks()}
                    </Anchor>
                </div>

                <div style={{ marginLeft: "200px" }}>{this.getTables()}</div>
            </>
        );
    }
}

const queryObj = {
    attack: {
        title: "攻击监控",
        query:
            "竞价金额大于1000万；现价>今日开盘价,股价涨幅大于3%,今日最高价>昨日收盘价*1.07,现价>分时均价；"
    },
    bid: {
        title: "竞价监控",
        query:
            "竞价金额大于1000万，竞价涨幅大于0.1%，昨日涨幅1%以上；股票简称不包括S；"
    },
    doubleBid: {
        title: "竞价倍量",
        query:
            "今日竞价金额大于2000万,今日竞价金额>昨日竞价金额*3,股价涨幅大于0.1%,股票简称不包括S；昨日涨幅5%以上；"
    },
    weakToStrong: {
        title: "弱转强监控",
        query:
            "前一个交易日最高价=涨停价,今日高开,竞价金额大于900万,股票名称不包含S；"
    },
    todayTop: {
        title: "当日前排",
        query:
            "9点40分收盘价=9点40分涨停价,股票简称不包含S,所属概念,,涨停原因，不包括新股；"
    },
    dailyLimitToday: {
        title: "当日涨停",
        query:
            "今日涨停,首次涨停时间从小到大排名,股票简称不包含s,所属概念,涨停原因,排除上市新股；"
    },
    firstDailyLimit: {
        title: "首板涨停",
        query:
            "连续涨停次数为1,首次涨停时间从小到大排名，所属概念，涨停原因,股票名称不包含S,排除上市新股；"
    },
    continueDailyLimit: {
        title: "连板股",
        query:
            "连续涨停次数大于等于2,首次涨停时间从小到大排名，所属概念，涨停原因,股票名称不包含S,排除上市新股；"
    },
    doubleDailyLimit: {
        title: "二连板",
        query:
            "连续涨停次数等于2,首次涨停时间从小到大排名，所属概念，涨停原因,股票名称不包含S,排除上市新股；"
    },
    tripleDailyLimit: {
        title: "三连板",
        query:
            "连续涨停次数等于3，首次涨停时间从小到大排名，所属概念，涨停原因,股票名称不包含S,排除上市新股；"
    },
    triplePlusDailyLimit: {
        title: "三连板+",
        query:
            "连续涨停次数大于等于3,首次涨停时间从小到大排名，所属概念，涨停原因,股票名称不包含S,排除上市新股；"
    },
    dailyLimitAndFried: {
        title: "连板炸板",
        query:
            "前一个交易日连续涨停天数大于等于1，今日最高价等于涨停价，收盘价低于涨停价，股票名称不包含S；"
    },
    dailyLimitBeforeToday: {
        title: "今曾涨停",
        query: "今日最高价等于涨停价，现价低于涨停价，股票名称不包含S；"
    },
    downLimitToday: {
        title: "当日跌停",
        query: "当日跌停，股票名称不包含S；"
    },
    dailyLimitYesterday: {
        title: "昨日涨停",
        query:
            "前一个交易日涨停,涨停时间,股票简称不包含S,所属概念,涨停原因,排除新股；"
    },
    firstDailyLimitYesterday: {
        title: "昨日首板",
        query:
            "昨日连续涨停天数等于1,涨停时间,股票简称不包含s,所属概念,涨停原因,排除上市新股；"
    },
    continueDailyLimitYesterday: {
        title: "昨日连板",
        query: "昨日连续涨停天数大于1,股票简称不包含S,排除上市新股；"
    },
    doubleDailyLimitYesterday: {
        title: "昨日二连板",
        query:
            "昨日连续涨停天数等于2,涨停时间,股票简称不包含s,所属概念,涨停原因,排除上市新股；"
    },
    tripleDailyLimitYesterday: {
        title: "昨日三连板",
        query:
            "昨日连续涨停天数等于3,涨停时间,股票简称不包含s,所属概念,涨停原因,排除上市新股；"
    },
    triplePlusDailyLimitYesterday: {
        title: "昨日三连板+",
        query:
            "昨日连续涨停天数大于等于3,涨停时间,股票简称不包含s,所属概念,涨停原因,排除上市新股；"
    },
    gainOverFive: {
        title: "大于5%涨幅",
        query: "今日涨幅大于5%，股票名称不包含S，不包括上市新股；"
    },
    declineOverFive: {
        title: "大于5%跌幅",
        query: "今日跌幅大于5%，股票名称不包含S，排除上市新股；"
    }
};

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
        title: "涨幅",
        dataIndex: "rise",
        align: "center",
        key: "rise",
        width: 150,
        sorter: (a, b) => a.rise * 1 - b.rise * 1,
        render: text => (
            <span style={{ color: text * 1 > 0 ? "#FF0000" : "#00FF00" }}>
                {text * 100 + "%"}
            </span>
        )
    },
    {
        title: "现价",
        dataIndex: "price",
        align: "center",
        className: "red",
        key: "price",
        width: 150
    },
    {
        title: "换手",
        dataIndex: "exchange",
        align: "center",
        key: "exchange",
        width: 150,
        render: text => <span>{text * 100 + "%"}</span>
    },
    {
        title: "涨停原因",
        dataIndex: "reason",
        align: "center",

        key: "reason",
        width: 150
    },
    {
        title: "昨日涨停原因",
        dataIndex: "prevReason",
        align: "center",

        key: "prevReason",
        width: 150
    },
    {
        title: "涨停封单额",
        dataIndex: "limitNum",
        align: "center",
        key: "limitNum",
        width: 150
    },
    {
        title: "主力净入",
        dataIndex: "mainBuyin",
        align: "center",

        key: "mainBuyin",
        width: 150,
        render: text => <span>{text / 10000 + "万"}</span>
    },
    { title: "所属板块", dataIndex: "belong", align: "center", key: "belong" }
];

const data = [];
for (let i = 0; i < 20; i++) {
    data.push({
        id: 600000 + i,
        name: "中国银行",
        price: 15.6,
        rise: 0.061 * (i % 2 === 0 ? -1 : 1),
        exchange: 0.12,
        reason: "贸易战",
        prevReason: `贸易战`,
        limitNum: "5000万",
        mainBuyin: `20000000`,
        belong: `银行`
    });
}
