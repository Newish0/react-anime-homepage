

export default class Season {
    static MONTH_TO_SEASON = ["winter", "spring", "summer", "fall"];

    static current() {
        const d = new Date();
        return Season.MONTH_TO_SEASON[Math.min(Math.floor(d.getMonth() / 3), 3)];
    }

    static currentYear() {
        const d = new Date();
        return d.getFullYear();
    }

}