import React, { useEffect, useEffectEvent, useState } from 'react'

const CalenderView = ({ task }) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarDays,setCalendarDays] = useState([])
     const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = currentDate.getMonth()
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const getCurrentYear = currentDate.getFullYear()
    const getCurrentMonth = monthNames[month]
    const getCurrentDate = currentDate.getDate()

    const currentDay = currentDate.getDay()

    const getCurrentDay = days[currentDay]


    const handlePreviousMonth = () => {
        setCurrentDate(new Date(getCurrentYear, currentDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(getCurrentYear, currentDate.getMonth() + 1))
    }





    const getCurrentMonthDays = () => {
    const firstDayOfMonth = new Date(getCurrentYear, currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(getCurrentYear, currentDate.getMonth() + 1, 0);
      const calendarData = []    
    for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
        const date = new Date(getCurrentDate,getCurrentMonth,getCurrentDay)
        const dayIn = new Date(d).getDay()
        const dayArr = days[dayIn]

        calendarData.push({
            date:new Date(d).getDate(),
            day:dayArr
        })
        
    }
    return calendarData
}

// console.log(daysArray)
useEffect(() => {
    let date = getCurrentMonthDays()
    
    setCalendarDays(date)
    }, [currentDate])
   
    
    return (

        <div className=''>
            <p>{getCurrentMonth}</p>
            <p>{getCurrentYear}</p>
            <p>{getCurrentDate}</p>
            <p>{getCurrentDay}</p>
            {/* <p>{getAllDays}</p> */}
            <button onClick={handlePreviousMonth}>
                Previous
            </button>
            <button onClick={handleNextMonth}>Next</button>
            <div className='calendar-days'>

            {
                calendarDays.map((calendarDay)=>(
                    <div className='view-div'>
                    <p >{calendarDay.day}</p>
                    <p >{calendarDay.date}</p>
                    </div>

                ))

            }
            </div>

        </div>
    )
}

export default CalenderView
