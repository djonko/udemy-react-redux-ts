import React, { useEffect } from 'react';
import './Calendar.css'
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/store';
import { loadUserEvents, selectUserEventsArray, UserEvent } from '../../redux/user-events';
import { addZero } from '../../lib/utils';

const mapState = (state: RootState) => ({
    events: selectUserEventsArray(state)
})
const mapDispatch = {
    loadUserEvents
}
const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
interface Props extends PropsFromRedux { }

const creatDateKey = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${addZero(year)}-${addZero(month)}-${addZero(day)}`
}




const groupEventsByDay = (events: UserEvent[]) => {

    const groups: Record<string, UserEvent[]> = {}

    const addToGroup = (dateKey: string, event: UserEvent) => {
        if (groups[dateKey] === undefined) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(event);
    }

    events.forEach((event) => {
        const startDateKey = creatDateKey(new Date(event.dateStart));
        const dateEndKey = creatDateKey(new Date(event.dateEnd));
        addToGroup(startDateKey, event);
        if (startDateKey !== dateEndKey) {
            addToGroup(dateEndKey, event);
        }

    })
    return groups
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
    //render for the first time
    useEffect(() => {
        loadUserEvents();
    }, []);

    let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
    let sortedGroupKeys: string[] | undefined;
    if (events.length) {
        groupedEvents = groupEventsByDay(events);
        sortedGroupKeys = Object.keys(groupedEvents).sort((prevDate, nextDate) => +new Date(prevDate) - +new Date(nextDate))
    }

    return groupedEvents && sortedGroupKeys ? (
        <div className="calendar">
            {
                sortedGroupKeys.map((dayKey) => {
                    const events = groupedEvents ? groupedEvents[dayKey] : [];
                    const groupDate = new Date(dayKey);
                    const day = groupDate.getUTCDate();
                    const month = groupDate.toLocaleString(undefined, { month: 'long' })

                    return (
                        <div className="calendar-day">
                            <div className="calendar-day-label">
                                <span>{day} {month}</span>
                            </div>
                            <div className="calendar-events">
                                {events.map(event => {
                                    return (
                                        <div key={event.id} className="calendar-event">
                                            <div className="calendar-event-info">
                                                <div className="calendar-event-time">10:00 - 12:00</div>
                                                <div className="calendar-event-title">{event.title}</div>
                                            </div>
                                            <button className="calendar-event-delete-button">&times;</button>
                                        </div>
                                    )
                                })
                                }

                            </div>
                        </div>
                    )
                })
            }
        </div>
    ) : <p>Loadind...</p>;
};

export default connector(Calendar);

