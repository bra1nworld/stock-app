import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import * as path from "path";
const puppeteer = require("puppeteer");
const absPath = path.resolve("./");
const startDateHour = absPath.indexOf("root") > 0 ? 1 : 9;
const Settings = {
    firstSearchUrl: `http://www.iwencai.com/data-robot/get-fusion-data?tid=stockpick&queryarea=&selfsectsn=&querytype=stock&w=`,
    lastSearchUrl: `&robot=%7B%22source%22%3A%22Ths_iwencai_Xuangu%22%2C%22user_id%22%3A%22%22%2C%22log_info%22%3A%22%7B%5C%22other_info%5C%22%3A%5C%22%7B%5C%5C%5C%22eventId%5C%5C%5C%22%3A%5C%5C%5C%22iwencai_pc_send_click%5C%5C%5C%22%2C%5C%5C%5C%22ct%5C%5C%5C%22%3A1555914480403%7D%5C%22%2C%5C%22other_utype%5C%22%3A%5C%22random%5C%22%2C%5C%22other_uid%5C%22%3A%5C%22Ths_iwencai_Xuangu_cqynx397124bd6kf8kr69sv7fd5lkgnu%5C%22%7D%22%2C%22user_name%22%3A%22sh6k0fh6hx%22%2C%22version%22%3A%221.6%22%2C%22add_info%22%3A%22%7B%5C%22urp%5C%22%3A%7B%5C%22scene%5C%22%3A1%7D%7D%22%2C%22secondary_intent%22%3A%22stock%22%7D`,
    firstGetAllStockUrl: `http://www.iwencai.com/stockpick/cache?token=`,
    middleGetAllStockUrl: `&p=1&perpage=`,
    lastGetAllStockUrl: `&changeperpage=1&showType=[%22%22,%22%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22,%22onTable%22]`
};
const commonQueryStr =
    "股票简称，现价，涨幅，9点25分分时量比，竞价金额，分时涨跌幅9点25，最新量能，实际换手率，连续涨停天数，涨停原因，昨日涨停原因，所属概念，股票名称不包含S，排除上市新股,";

export const QueryAttack = new Mongo.Collection("queryAttack");
export const QueryBid = new Mongo.Collection("queryBid");
export const QueryDoubleBid = new Mongo.Collection("queryDoubleBid");
export const QueryWeakToStrong = new Mongo.Collection("queryWeakToStrong");
export const QueryTodayTop = new Mongo.Collection("queryTodayTop");
export const QueryDLToday = new Mongo.Collection("queryDLToday");
export const QueryFirstDL = new Mongo.Collection("queryFirstDL");
export const QueryContinueDL = new Mongo.Collection("queryContinueDL");
export const QueryDoubleDL = new Mongo.Collection("queryDoubleDL");
export const QueryTripleDL = new Mongo.Collection("queryTripleDL");
export const QueryTriplePlusDL = new Mongo.Collection("queryTriplePlusDL");
export const QueryDLAndFried = new Mongo.Collection("queryDLAndFried");
export const QueryDLBeforeToday = new Mongo.Collection("queryDLBeforeToday");
export const QueryDownLimitToday = new Mongo.Collection("queryDownLimitToday");
export const QueryDLY = new Mongo.Collection("queryDLY");
export const QueryFirstDLY = new Mongo.Collection("queryFirstDLY");
export const QueryContinueDLY = new Mongo.Collection("queryContinueDLY");
export const QueryDoubleDLY = new Mongo.Collection("queryDoubleDLY");
export const QueryTripleDLY = new Mongo.Collection("queryTripleDLY");
export const QueryTriplePlusDLY = new Mongo.Collection("queryTriplePlusDLY");
export const QueryGainOverFive = new Mongo.Collection("queryGainOverFive");
export const QueryDeclineOverFive = new Mongo.Collection(
    "queryDeclineOverFive"
);

const queryObj = {
    queryAttack: {
        db: QueryAttack,
        title: "攻击监控",
        queryStr: `${commonQueryStr}竞价金额大于1000万；现价>今日开盘价,股价涨幅大于3%,今日最高价>昨日收盘价*1.07,现价>分时均价；`
    },
    queryBid: {
        db: QueryBid,
        title: "竞价监控",
        queryStr: `${commonQueryStr}竞价金额大于1000万，竞价涨幅大于0.1%，昨日涨幅1%以上；`
    },
    queryDoubleBid: {
        db: QueryDoubleBid,
        title: "竞价倍量",
        queryStr: `${commonQueryStr}今日竞价金额大于2000万,今日竞价金额>昨日竞价金额*3,股价涨幅大于0.1%,昨日涨幅5%以上；`
    },
    queryWeakToStrong: {
        db: QueryWeakToStrong,
        title: "弱转强监控",
        queryStr: `${commonQueryStr}前一个交易日最高价=涨停价,今日高开,竞价金额大于900万；`
    },
    queryTodayTop: {
        db: QueryTodayTop,
        title: "当日前排",
        queryStr: `${commonQueryStr}9点40分收盘价=9点40分涨停价；`
    },
    queryDLToday: {
        db: QueryDLToday,
        title: "当日涨停",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间,今日涨停,首次涨停时间从小到大排名；`
    },
    queryFirstDL: {
        db: QueryFirstDL,
        title: "首板涨停",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，连续涨停次数为1,首次涨停时间从小到大排名；`
    },
    queryContinueDL: {
        db: QueryContinueDL,
        title: "连板股",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，连续涨停次数大于等于2,首次涨停时间从小到大排名；`
    },
    queryDoubleDL: {
        db: QueryDoubleDL,
        title: "二连板",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，连续涨停次数等于2,首次涨停时间从小到大排名；`
    },
    queryTripleDL: {
        db: QueryTripleDL,
        title: "三连板",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，连续涨停次数等于3,首次涨停时间从小到大排名；`
    },
    queryTriplePlusDL: {
        db: QueryTriplePlusDL,
        title: "三连板+",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，连续涨停次数大于等于3,首次涨停时间从小到大排名；`
    },
    queryDLAndFried: {
        db: QueryDLAndFried,
        title: "连板炸板",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，前一个交易日连续涨停天数大于等于1，今日最高价等于涨停价，收盘价低于涨停价；`
    },
    queryDLBeforeToday: {
        db: QueryDLBeforeToday,
        title: "今曾涨停",
        queryStr: `${commonQueryStr}，首次涨停时间，最终涨停时间，今日最高价等于涨停价，现价低于涨停价；`
    },
    queryDownLimitToday: {
        db: QueryDownLimitToday,
        title: "当日跌停",
        queryStr: `${commonQueryStr}当日跌停；`
    },
    queryDLY: {
        db: QueryDLY,
        title: "昨日涨停",
        queryStr: `${commonQueryStr},涨停时间,前一个交易日涨停；`
    },
    queryFirstDLY: {
        db: QueryFirstDLY,
        title: "昨日首板",
        queryStr: `${commonQueryStr},涨停时间,昨日连续涨停天数等于1；`
    },
    queryContinueDLY: {
        db: QueryContinueDLY,
        title: "昨日连板",
        queryStr: `${commonQueryStr},涨停时间,昨日连续涨停天数大于1；`
    },
    queryDoubleDLY: {
        db: QueryDoubleDLY,
        title: "昨日二连板",
        queryStr: `${commonQueryStr},涨停时间,昨日连续涨停天数等于2；`
    },
    queryTripleDLY: {
        db: QueryTripleDLY,
        title: "昨日三连板",
        queryStr: `${commonQueryStr},涨停时间,昨日连续涨停天数等于3；`
    },
    queryTriplePlusDLY: {
        db: QueryTriplePlusDLY,
        title: "昨日三连板+",
        queryStr: `${commonQueryStr},涨停时间,昨日连续涨停天数大于等于3；`
    },
    queryGainOverFive: {
        db: QueryGainOverFive,
        title: "大于5%涨幅",
        queryStr: `${commonQueryStr},今日涨幅大于5%；`
    },
    queryDeclineOverFive: {
        db: QueryDeclineOverFive,
        title: "大于5%跌幅",
        queryStr: `${commonQueryStr},今日跌幅大于5%；`
    }
};

if (Meteor.isServer) {
    Object.keys(queryObj).forEach(key => {
        const { db } = queryObj[key];
        Meteor.publish(key, function publication() {
            return db.find({});
        });
    });

    (async () => {
        let browser = await puppeteer.launch({
            timeout: 30000,
            ignoreHTTPSErrors: true,
            devtools: false,
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        Object.keys(queryObj).forEach(key => {
            singlePage(browser, queryObj[key]);
        });
    })();

    async function singlePage(browser, queryValue) {
        const { db, title, queryStr } = queryValue;
        const searchPage = await browser.newPage();

        searchPage.on("response", async res => {
            if (res.url().includes("www.iwencai.com")) {
                let resJson;
                try {
                    resJson = await res.json();
                } catch (error) {
                    if (!resJson || error) {
                        goPage(
                            searchPage,
                            `${Settings.firstSearchUrl}${encodeURI(queryStr)}${
                                Settings.lastSearchUrl
                            }`
                        );
                        return;
                    }
                }
                console.log("---resJson---");
                const { oriIndexID, result, data } = resJson;

                if (data) {
                    //first search
                    const { total, token } = resJson.data.wencai_data.result;

                    goPage(
                        searchPage,
                        `${Settings.firstGetAllStockUrl}${encodeURI(token)}${
                            Settings.middleGetAllStockUrl
                        }${encodeURI(total)}${Settings.lastGetAllStockUrl}`
                    );
                } else if (oriIndexID) {
                    //second search
                    console.log(result.length);
                    const now = new Date();

                    if (result.length > 0) {
                        const todayDate =
                            now.getFullYear() * 10000 +
                            (now.getMonth() + 1) * 100 +
                            now.getDate();
                        const colTodayData = db.findOne({
                            date: todayDate
                        });

                        if (colTodayData) {
                            console.log("update");

                            const _id = colTodayData._id;
                            db.update(_id, {
                                $set: {
                                    result,
                                    lastUpdateAt:
                                        Date.now()
                                }
                            });
                        } else {
                            console.log("insert");
                            db.insert({
                                date: todayDate,
                                lastUpdateAt:
                                    Date.now()
                                title,
                                queryStr,
                                result
                            });
                        }
                    }

                    //9:10-15:10
                    let todayStart = new Date(now).setHours(
                        startDateHour,
                        10,
                        0,
                        0
                    );
                    let todayEnd = new Date(now).setHours(
                        startDateHour + 6,
                        10,
                        0,
                        0
                    );

                    if (now > todayStart && now < todayEnd) {
                        goPage(
                            searchPage,
                            `${Settings.firstSearchUrl}${encodeURI(queryStr)}${
                                Settings.lastSearchUrl
                            }`
                        );
                    } else {
                        setTimeout(() => {
                            goPage(
                                searchPage,
                                `${Settings.firstSearchUrl}${encodeURI(
                                    queryStr
                                )}${Settings.lastSearchUrl}`
                            );
                        }, 10 * 60000);
                    }
                }
            }
        });
        await searchPage.goto(
            `${Settings.firstSearchUrl}${encodeURI(queryStr)}${
                Settings.lastSearchUrl
            }`
        );
        async function goPage(searchPage, url) {
            try {
                await searchPage.goto(url);
            } catch (error) {
                if (error) {
                    setTimeout(() => {
                        goPage(searchPage, url);
                    }, 30000);
                }
            }
        }
    }
}
