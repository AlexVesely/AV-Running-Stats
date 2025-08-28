class Run {
    constructor(date, distance, hours, minutes, seconds) {
        this.date = date;
        this.distance = distance;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    getTotalSeconds() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }

    getPace() {
        const paceSeconds = this.getTotalSeconds() / this.distance;
        const paceMinutes = Math.floor(paceSeconds / 60);
        const paceRemainingSeconds = Math.round(paceSeconds % 60)
            .toString()
            .padStart(2, "0");
        const paceFormatted = `${paceMinutes}:${paceRemainingSeconds} min/km`;
        return paceFormatted
    }
}

export default Run; // so it can imported in log.js
