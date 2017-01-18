export default function reducer(state={ services: [
      {name: 'Sam', time: '8:00am - 8:00pm'},
      {name: 'Jo', time: '8:00am - 8:00pm'},
      {name: 'Chris', time: '8:00am - 8:00pm'},
      {name: 'Zack', time: '8:00am - 8:00pm'},
      {name: 'HoKeun', time: '8:00am - 8:00pm'}
    ] }, action) {
    switch (action.type) {
      case "FETCH_SCHEDULE_FULFILLED": {
        return {
          ...state,
          services: action.payload,
        }
      }
    }
    return state
}
