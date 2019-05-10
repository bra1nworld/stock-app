import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { oldData } from "../oldData";
const puppeteer = require("puppeteer");
const Settings = {
    firstSearchUrl: `http://1.push2his.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&iscr=0&ndays=1&secid=90.BK0815&cb=jQuery183010876406714142406_1556033065016&_=1556033065316`
};

export const DailyLimit = new Mongo.Collection('dailyLimit');

if (Meteor.isServer) {
    Meteor.publish('dailyLimit', function dailyLimitPublication() {
        return DailyLimit.find({
        })
    })
    const allDataLen = DailyLimit.find({}).count()

    if (allDataLen === 0) {
        for (let item of oldData) {
            DailyLimit.insert(item)
        }
    } else {
        (async () => {
            const browser = await puppeteer.launch({
                timeout: 15000,
                ignoreHTTPSErrors: true,
                devtools: false,
                headless: true
            });

            const searchPage = await browser.newPage();

            searchPage.on("response", async res => {
                const resText = await res.text();
                const resultJsonStr = resText.match(/[^\(\)]+(?=\))/g)[0];
                const resJson = JSON.parse(resultJsonStr)
                updateDailyLimitYesterday(resJson.data)

                const now = Date.now();
                let todayStart = new Date(now).setHours(9, 25, 0, 0);
                let todayEnd = new Date(now).setHours(15, 00, 0, 0);

                if (now > todayStart && now < todayEnd) {
                    setTimeout(async () => {
                        await searchPage.goto(
                            `${Settings.firstSearchUrl}`
                        );
                    }, 60000);
                } else {
                    setTimeout(async () => {
                        await searchPage.goto(
                            `${Settings.firstSearchUrl}`
                        );
                    }, 5 * 60000);
                }
            });

            await searchPage.goto(
                `${Settings.firstSearchUrl}`
            );
        })();
    }

    function updateDailyLimitYesterday(data) {
        const { preClose, trends } = data;

        const todayDate = trends[0].slice(0, 10).split(" ")[0].split("-").join("") * 1;

        const colTodayData = DailyLimit.findOne({
            date: todayDate
        })
        console.log(trends.length);

        if (colTodayData) {
            console.log('update');
            const _id = colTodayData._id
            DailyLimit.update(_id, {
                $set: {
                    trends
                }
            })
        } else {
            console.log('insert');

            DailyLimit.insert({
                date: todayDate,
                preClose,
                trends
            })
        }
    }

}

Meteor.methods({
    // 'DailyLimit.find'() {
    //     return DailyLimit.find({})
    // },
    // 'tasks.remove'(taskId) {
    //     check(taskId, String);
    //     const task = Tasks.findOne(taskId);
    //     if (task.private && task.owner !== this.userId) {
    //         // If the task is private, make sure only the owner can delete it
    //         throw new Meteor.Error('not-authorized');
    //     }
    //     Tasks.remove(taskId)
    // },
    // 'tasks.setChecked'(taskId, setChecked) {
    //     check(taskId, String);
    //     check(setChecked, Boolean)
    //     const task = Tasks.findOne(taskId);
    //     if (task.private && task.owner !== this.userId) {
    //         // If the task is private, make sure only the owner can check it off
    //         throw new Meteor.Error('not-authorized');
    //     }
    //     Tasks.update(taskId, { $set: { checked: setChecked } })
    // },
    // 'tasks.setPrivate'(taskId, setToPrivate) {
    //     check(taskId, String)
    //     check(setToPrivate, Boolean)

    //     const task = Tasks.findOne(taskId)
    //     if (task.owner !== this.userId) {
    //         throw new Meteor.Error('not-authorized')
    //     }
    //     Tasks.update(taskId, { $set: { private: setToPrivate } })
    // }
})