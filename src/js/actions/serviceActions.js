export function fetchSchedule() {
	console.log("fech scheudle")
  return {
    type: "FETCH_SCHEDULE_FULFILLED",
    payload: [
    	{name: 'Sam', time: '8:00am - 8:00pm'},
    	{name: 'Jo', time: '8:00am - 8:00pm'},
    	{name: 'Chris', time: '8:00am - 8:00pm'},
    	{name: 'Zack', time: '8:00am - 8:00pm'},
    	{name: 'HoKeun', time: '8:00am - 8:00pm'}
    ]
  }
}