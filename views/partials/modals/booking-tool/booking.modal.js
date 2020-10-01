import { setModal } from "../modals";

const days = [`sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`];
const months = [
    `January`, `February`, `March`, `April`, `May`, `June`, `July`,
    `August`, `September`, `October`, `November`, `December`
];

const daysInMonth = ({ year, month }) => new Date(year, month, 0).getDate();

const modalNode = document.querySelector(`[data-modal="booking-tool"]`);
const bookingFormModal = document.querySelector(`[data-modal="booking-form"]`);
const monthSelect = modalNode.querySelector(`.monthWrapper`);
const dateTitle = modalNode.querySelector(`.dateTitle`);
const monthTitle = dateTitle.querySelector(`.monthTitle`);
const yearTitle = dateTitle.querySelector(`.yearTitle`);
const monthArrows = [...modalNode.querySelectorAll(`.monthArrow`)];
const tableDays = modalNode.querySelector(`.tableDays`);
const weekHeader = modalNode.querySelector(`.dateHeader`);
const weekHeaderNums = [...weekHeader.querySelectorAll(`.dayTitle`)];
const weekWrapper = modalNode.querySelector(`.dateTables`);
const weekArrows = [...modalNode.querySelectorAll(`.weekArrow`)];
const loaderWrapper = modalNode.querySelector(`.loaderWrapper`);
const bookingTime = bookingFormModal.querySelector(`.bookingTime`);
const timeField = bookingFormModal.querySelector(`.hiddenField`);
const specField = bookingFormModal.querySelector(`.specField`);

let isModalVisible = false;

const changeWrapperVisible = () => {
    const classAction = (isModalVisible) ? `remove` : `add`;
    monthSelect.classList[classAction](`activeWrapper`);
    isModalVisible = !isModalVisible;
};

const updateWeekHeader = (weekDays) => {
    weekHeaderNums.forEach((dayNode, index) => {
        dayNode.innerText = weekDays[index].getDate();
    });
};

const createDay = (hour) => {
    const zone = (hour > 12) ? `PM` : `AM`;
    const time = (hour > 12) ? hour - 12 : hour;
    const dayNode = document.createElement(`li`);
    dayNode.classList.add(`time`);
    const timeTitle = document.createElement(`span`);
    timeTitle.innerText = `${time}:00`;
    const timeZone = document.createElement(`em`);
    timeZone.innerText = zone;
    dayNode.appendChild(timeTitle);
    dayNode.appendChild(timeZone);
    return dayNode;
};

const updateWeekData = (weekDays) => {
    const { dataset: { start, end }} = weekWrapper;
    weekWrapper.innerHTML = ``;
    weekDays.forEach((day) => {
        // create time list
        const dayList = document.createElement(`ul`);
        dayList.classList.add(`dayTimes`);
        const currentDate = new Date();
        day.setHours(Number(start));
        const startHour = day.getHours();
        day.setHours(Number(end));
        const endHour = day.getHours();
        for (let hour = startHour; hour <= endHour; hour++) {
            const dayNode = createDay(hour);
            const requestDate = new Date(Number(day));
            requestDate.setHours(hour);
            dayNode.dataset.year = String(requestDate.getFullYear());
            dayNode.dataset.month = String(requestDate.getMonth());
            dayNode.dataset.day = String(requestDate.getDate());
            dayNode.dataset.time = String(requestDate.getHours());
            // set offset there if need timeout
            if (requestDate <= currentDate) dayNode.classList.add(`disableTime`);
            dayList.appendChild(dayNode);
        }
        weekWrapper.appendChild(dayList);
    });
};

const checkDisableDates = (calendar) => {
    if (!calendar || !calendar.length) return false;
    calendar.forEach((calendarData) => {
        const startDate = new Date(calendarData.start.dateTime);
        const endDate = new Date(calendarData.end.dateTime);
        const length = endDate.getHours() - startDate.getHours() + 1;
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        const day = startDate.getDate();
        const time = startDate.getHours();
        for (let hour = time; hour <= time + length - 2; hour++) {
            const selector = `[data-year="${year}"][data-month="${month}"][data-day="${day}"][data-time="${hour}"]`;
            const searchNode = document.querySelector(selector);
            if (searchNode) searchNode.classList.add(`disableTime`);
        }
    });
}

const checkWeekArrows = (firstDay) => {
    if (!weekArrows[0]) return false;
    const newDate = firstDay.setDate(firstDay.getDate() - 7);
    const currentDate = new Date();
    const classAction = (newDate < currentDate) ? `add` : `remove`;
    weekArrows[0].classList[classAction](`disableArrow`);
};

const updateWeek = ({ year, month, day, calendar }) => {
    const requestDate = new Date(year, month, day);
    const weekDays = [];
    const firstDay = new Date(year, month, day);
    firstDay.setDate(firstDay.getDate() - requestDate.getDay() + 1);
    for (let dayNum = 1; dayNum <= 7; dayNum++) {
        const offset = (dayNum === 1) ? firstDay.getDate() : firstDay.getDate() + 1;
        const newDate = firstDay.setDate(offset);
        weekDays.push(new Date(newDate));
    }
    updateWeekHeader(weekDays);
    updateWeekData(weekDays);
    checkWeekArrows(firstDay);
    checkDisableDates(calendar);
    addCalendarEvents();
};

const dayClickHandler = (dayNode) => {
    return async () => {
        if (dayNode.classList.contains(`currentDay`)) return false;
        const { dataset: { day }} = dayNode;
        const { dataset: { month, year }} = dateTitle;
        const { dataset: { spec }} = weekWrapper;
        const body = new FormData();
        body.append(`userID`, spec);
        loaderWrapper.classList.add(`activeWrapper`);
        const calendar = await fetch(`/api/booking/calendar`, { method: `POST`, body });
        const { calendar: { data }} = await calendar.json();
        loaderWrapper.classList.remove(`activeWrapper`);
        //
        const requestData = { year: Number(year), month: Number(month), day: Number(day), calendar: data };
        updateWeek(requestData);
        weekWrapper.dataset.year = year;
        weekWrapper.dataset.month = month;
        changeWrapperVisible();
    }
};

const createMonthDays = (requestData) => {
    const { year, month } = requestData;
    tableDays.innerHTML = ``;
    const monthLength = daysInMonth(requestData);
    let firstDay = (new Date(year, month - 1, 1)).getDay();
    if (firstDay === 0) firstDay = 7;
    const currentDay = (new Date()).getDate();
    const currentMonth = (new Date()).getMonth();
    const currentYear = (new Date()).getFullYear();
    let dayNum = 1;
    for (let index = 1; dayNum <= monthLength; index++) {
        const newDay = document.createElement(`li`);
        if (index < firstDay) {
            newDay.classList.add(`empty`);
            tableDays.appendChild(newDay);
            continue;
        }
        const isPastDay = (
            currentDay > dayNum &&
            currentMonth + 1 === Number(month) &&
            currentYear === Number(year)
        );
        const dayClass = (isPastDay) ? `disableDay` : `monthDay`;
        newDay.classList.add(dayClass);
        newDay.dataset.day = String(dayNum);
        const innerSpan = document.createElement(`span`);
        innerSpan.classList.add(`day`);
        innerSpan.innerText = String(dayNum);
        newDay.appendChild(innerSpan);
        if (currentMonth === month && currentYear === year && currentDay === dayNum) {
            newDay.classList.add(`currentDay`);
        }
        tableDays.appendChild(newDay);
        newDay.addEventListener(`click`, dayClickHandler(newDay));
        dayNum++;
    }
};

const checkArrowsVisible = ({ year, month }) => {
    const currentYear = (new Date()).getFullYear();
    const currentMonth = (new Date()).getMonth();
    const isDisable = (currentYear === Number(year) && currentMonth === Number(month));
    const classAction = (isDisable) ? `add` : `remove`;
    monthArrows[0].classList[classAction](`disableArrow`);
};

const updateTitleData = ({ year, month }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const isPast = (currentYear === Number(year) && currentMonth > Number(month));
    const selectMonth = (isPast) ? Number(month) + 1 : Number(month);
    monthTitle.innerText = months[selectMonth];
    yearTitle.innerText = year;
    dateTitle.dataset.month = String(selectMonth);
    dateTitle.dataset.year = year;
};

const selectMonthHandler = () => {
    // if we close month select without select day
    if (isModalVisible) {
        const { dataset: { year, month }} = weekWrapper;
        updateTitleData({ year, month });
        createMonthDays({ year: Number(year), month: Number(month) });
        return changeWrapperVisible();
    }
    const { dataset: { year, month }} = dateTitle;
    createMonthDays({ year: Number(year), month: Number(month) });
    changeWrapperVisible();
    checkArrowsVisible({ year, month });
};

const arrowClickHandler = (arrowNode) => {
    return () => {
        if (arrowNode.classList.contains(`disableArrow`)) return false;
        const { dataset: { month: currentMonth, year: currentYear }} = dateTitle;
        let month = Number(currentMonth);
        let year = Number(currentYear);
        // check for first && last months
        const isPrev = (arrowNode.classList.contains(`prevArrow`));
        year = (month === (isPrev ? 1 : 12)) ? (isPrev) ? year - 1 : year + 1 : year;
        month = (month === (isPrev ? 1 : 12)) ? (isPrev ? 12 : 1) : (isPrev) ? month - 1 : month + 1;
        // update year
        const requestData = { year, month };
        updateTitleData(requestData);
        createMonthDays(requestData);
        checkArrowsVisible(requestData);
    };
};

const monthSelector = () => {
    dateTitle.addEventListener(`click`, selectMonthHandler);
    monthArrows.forEach((arrowNode) => {
        arrowNode.addEventListener(`click`, arrowClickHandler(arrowNode));
    });
};

const addCalendarEvents = () => {
    const timeNodes = [...modalNode.querySelectorAll(`.time`)];
    const checkDayTimeline = () => {
        const dayNodes = [...modalNode.querySelectorAll(`.dayTimes`)];
        dayNodes.forEach((dayNode) => {
            const timeNodes = [...dayNode.querySelectorAll(`.time:not(.disableTime)`)];
            if (timeNodes.length < 3) return dayNode.classList.add(`disableDay`);
            let isInvalid = true;
            timeNodes.forEach((timeNode) => {
                const prevNode = timeNode.previousSibling || timeNode.nextSibling.nextSibling;
                const nextNode = timeNode.nextSibling || timeNode.previousSibling.previousSibling;
                const isDisable = timeNode.classList.contains(`disableTime`) ||
                    prevNode.classList.contains(`disableTime`) ||
                    nextNode.classList.contains(`disableTime`);
                if (!isDisable) isInvalid = false;
            });
            if (isInvalid) dayNode.classList.add(`disableDay`);
        });
    };
    timeNodes.forEach((timeNode) => {
        const removeClass = (className) => {
            timeNodes.forEach((timeNode) => timeNode.classList.remove(className));
        };
        timeNode.addEventListener(`mouseover`, () => {
            const prevNode = timeNode.previousSibling || timeNode.nextSibling.nextSibling;
            const nextNode = timeNode.nextSibling || timeNode.previousSibling.previousSibling;
            const isDisable = timeNode.classList.contains(`disableTime`) ||
                              prevNode.classList.contains(`disableTime`) ||
                              nextNode.classList.contains(`disableTime`);
            const selector = (isDisable) ? `errorTime` : `hoverTime`;
            timeNode.classList.add(selector);
            prevNode.classList.add(selector);
            nextNode.classList.add(selector);
        });
        timeNode.addEventListener(`mouseout`, () => {
            removeClass(`errorTime`);
            removeClass(`hoverTime`);
        });
        timeNode.addEventListener(`click`, () => {
            const prevNode = timeNode.previousSibling || timeNode.nextSibling.nextSibling;
            const nextNode = timeNode.nextSibling || timeNode.previousSibling.previousSibling;
            const isDisable = timeNode.classList.contains(`disableTime`) ||
                prevNode.classList.contains(`disableTime`) ||
                nextNode.classList.contains(`disableTime`);
            if (isDisable) return false;
            const { dataset: data } = timeNode;
            const customEvent = new CustomEvent(`selectDate`, { detail: { data }});
            document.dispatchEvent(customEvent);
            // removeClass(`selectTime`);
            // timeNode.classList.add(`selectTime`);
            // prevNode.classList.add(`selectTime`);
            // nextNode.classList.add(`selectTime`);
        });
    });
    checkDayTimeline();
};

const bookingForm = () => {
    document.addEventListener(`selectDate`, (event) => {
        const { detail: { data: { year, month, day, time }}} = event;
        const selectDate = new Date(year, month, day, time);
        const { dataset: { spec }} = weekWrapper;
        // change date data
        const hours = selectDate.getHours() - 1;
        const selectTime = (hours > 12) ? hours - 12 : hours;
        const selectZone = (hours > 12) ? `PM` : `AM`;
        bookingTime.querySelector(`.selectDay`).innerText = days[selectDate.getDay()];
        bookingTime.querySelector(`.selectMonth`).innerText = months[selectDate.getMonth()];
        bookingTime.querySelector(`.selectDate`).innerText = selectDate.getDate();
        bookingTime.querySelector(`.selectYear`).innerText = selectDate.getFullYear();
        bookingTime.querySelector(`.selectTime`).innerText = `${selectTime}:00 ${selectZone}`;
        // set hidden value
        timeField.value = Number(selectDate);
        specField.value = spec;
        modalNode.classList.remove(`activeModal`);
        bookingFormModal.classList.add(`activeModal`);
    });
};

const setWeekArrows = () => {
    weekArrows.forEach((arrow) => {
        arrow.addEventListener(`click`, async () => {
            if (arrow.classList.contains(`disableArrow`)) return false;
            const timeNode = document.querySelector(`.dayTimes .time`);
            const { dataset: { year: checkYear, month: checkMonth, day: checkDay }} = timeNode;
            const { dataset: { spec }} = weekWrapper;
            const checkDate = new Date(checkYear, checkMonth, checkDay);
            const isPrev = (arrow.classList.contains(`prevArrow`));
            const changeOffset = (isPrev) ? checkDate.getDate() - 7 : checkDate.getDate() + 7;
            checkDate.setDate(changeOffset);
            const year = checkDate.getFullYear();
            const month = checkDate.getMonth();
            const day = checkDate.getDate();
            const body = new FormData();
            body.append(`userID`, spec);
            loaderWrapper.classList.add(`activeWrapper`);
            const calendar = await fetch(`/api/booking/calendar`, { method: `POST`, body });
            const { calendar: { data }} = await calendar.json();
            loaderWrapper.classList.remove(`activeWrapper`);
            weekWrapper.dataset.year = String(year);
            weekWrapper.dataset.month = String(month);
            updateTitleData({ year, month });
            updateWeek({ year, month, day, calendar: data });
        });
    });
};

const showBooking = () => {
    document.addEventListener(`bookingData`, (event) => {
        const { detail: { data, userID, timeStart, timeEnd }} = event;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();
        const requestData = { year, month, day, calendar: data };
        weekWrapper.dataset.spec = userID;
        weekWrapper.dataset.start = timeStart;
        weekWrapper.dataset.end = timeEnd;
        updateWeek(requestData);
        updateTitleData({ year, month });
        const calendarModal = document.querySelector(`[data-modal="booking-tool"]`);
        if (calendarModal) calendarModal.classList.add(`activeModal`);
    });
};

export const bookingTool = () => {
    monthSelector();
    bookingForm();
    showBooking();
    setWeekArrows();
    setModal(`booking-tool`);
    setModal(`booking-form`);
};