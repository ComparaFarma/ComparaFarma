import moment from "moment"
import 'moment/dist/locale/pt-br.js';

export const useDateUtils = () => {
    const i18n = useI18n()
    moment.locale(i18n.locale.value)

    const formatDate = (date: Date, format: string) => {
        return moment(date).format(format)
    }

    const getDateFromNowFormated = (date: Date) => {
        return moment(date).fromNow()
    }

    const getDateCalendarFormated = (date: Date) => {
        return moment(date).calendar()
    }
    
    return {
        formatDate,
        getDateFromNowFormated,
        getDateCalendarFormated,
    }
   
}