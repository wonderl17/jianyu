export function  getTime(time, type='second')  {
    function isLeapYear(year) {
        return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
    }
    function getMonthDays(year, month) {
        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    }
    let targetDay = new Date(time);
    let year = targetDay.getFullYear();
    let month = targetDay.getMonth() + 1;
    let days = targetDay.getDate();
    let hour = targetDay.getHours()
    let minute = targetDay.getMinutes()
    let second = targetDay.getSeconds()
    if (type === 'week') {
        //那一天是那一年中的第多少天
        for (let i = 1; i < month ; i++) {
            days += getMonthDays(year, i);
        }
        //那一年第一天是星期几
        let yearFirstDay = new Date(year, 0, 1).getDay();
        //计算是第几周
        days -= (7 - yearFirstDay + 1);
        let week = Math.ceil(days / 7) + 1;
        return year + '年第' + (week < 10 ? '0' : '') + week + '周';
    } else if (type === 'year') {
        return year + '年'
    } else if (type === 'month') {
        return year + '-' + (month<10?'0':'') + month
    } else if (type === 'second') {
        return year + '-' + (month<10?'0':'') + month + '-' + (days<10?'0':'') + days + ' ' +
            (hour<10?'0':'') + hour + ':' + (minute<10?'0':'') + minute + ':' + (second<10?'0':'') + second
    } else if (type === 'quarter') {
        let num = Math.ceil(month/3)
        return year + '年第' + num + '季度'
    } else if (type === 'day') {
        return year + '-' + (month<10?'0':'') + month + '-' + (days<10?'0':'') + days
    }
}