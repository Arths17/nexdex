import React, { useEffect, useEffectEvent, useState } from 'react'

const CalenderView = ({ task }) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    
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
        setCurrentDate(new Date(getCurrentYear,  currentDate.getMonth() - 1))
        }

    const handleNextMonth = () => {
        setCurrentDate(new Date(getCurrentYear, currentDate.getMonth() + 1))
    }

    const getCurrentMonthDays = () => {
        const firsDayOfMonth = new Date(getCurrentYear, currentDate.getMonth(), 1)
        const lastDayOfMonth = new Date(getCurrentYear, currentDate.getMonth() + 1, 0)
        console.log(firsDayOfMonth)
        console.log(lastDayOfMonth)
    }

    useEffect(()=>{
        getCurrentMonthDays()
    },[])


const g = getCurrentMonthDays();
console.log(g);
    return (

        <div className=''>
            <p>{getCurrentMonth}</p>
            <p>{getCurrentYear}</p>
            <p>{getCurrentDate}</p>
            <p>{getCurrentDay}</p>
            <button onClick={handlePreviousMonth}>
                Previous
            </button>
            <button onClick={handleNextMonth}>Next</button>
        </div>
    )
}

export default CalenderView
