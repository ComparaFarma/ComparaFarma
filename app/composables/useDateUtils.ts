import moment from "moment"
import 'moment/dist/locale/pt-br.js';

export const useDateUtils = () => {
    const formatDate = (date: Date, format: string) => {
        return moment(date.toUTCString()).format(format)
    }

    const getDate = (parse: string) => {
        return moment.utc(parse).toDate()
    }

    const getDateFromNowFormated = (date: Date) => {
        return moment(date.toUTCString()).fromNow()
    }

    const getDateCalendarFormated = (date: Date) => {
        console.log(date)
        return moment(date.toUTCString()).calendar()
    }
    
    return {
        getDate,
        formatDate,
        getDateFromNowFormated,
        getDateCalendarFormated,
    }
   
}