function isWeekend(date) {
      const dayOfWeek = date.format('dddd');
      if(dayOfWeek === 'Friday'){
        return true;
      }
      return false;
    }

export default isWeekend;