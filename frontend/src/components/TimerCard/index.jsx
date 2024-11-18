import {useEffect, useState} from "react";

export default function TimerCard({}) {

    const [timer, setTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(calTimeLeft());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const calTimeLeft = () => {
        const now = new Date();
        let daysToWeekend = 6 - now.getDay();
        let hoursToWeekend = 24 - now.getHours();
        let minutesToWeekend = 60 - now.getMinutes();
        let secondsToWeekend = 60 - now.getSeconds();

        if (secondsToWeekend === 60) {
            secondsToWeekend = 0;
            minutesToWeekend += 1;
        }

        if (minutesToWeekend === 60) {
            minutesToWeekend = 0;
            hoursToWeekend += 1;
        }

        if (hoursToWeekend === 24) {
            hoursToWeekend = 0;
            daysToWeekend += 1;
        }

        return {
            days: daysToWeekend.toString().padStart(2, "0"),
            hours: hoursToWeekend.toString().padStart(2, "0"),
            minutes: minutesToWeekend.toString().padStart(2, "0"),
            seconds: secondsToWeekend.toString().padStart(2, "0"),
        };
    };

    return (
        <>
            <div>
                <div className="grey-text" style={{fontSize: "15px"}}>
                    {"Ends in " + timer.days + ":" + timer.hours + ":" + timer.minutes + ":" + timer.seconds}
                </div>
            </div>
        </>
    )

}