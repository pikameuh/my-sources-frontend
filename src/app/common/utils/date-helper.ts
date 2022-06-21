import { DatePipe } from '@angular/common';

export class DateHelper {

    static MS_PER_DAY: number = 1000 * 60 * 60 * 24;

    public static parseDateFromDbToNumber(date: Date): number{
    //  console.log(` parseDateForComputing(${date})`);
        const dateStr = date.toString();
        
        const truncatedDate = dateStr.substring(0, dateStr.indexOf('T'));
        // console.log(` truncatedDate: ${truncatedDate}`);
    
        // const dateArray: string[] = truncatedDate.split('-');
        // console.log(` dateArray order: ${dateArray[0]} ${dateArray[1]} ${dateArray[2]}`);
    
        var resDate = Date.parse(truncatedDate);
        // resDate.setFullYear(parseInt(dateArray[2]), parseInt(dateArray[1]), parseInt(dateArray[0]));
    
        // console.log(` resDate: ${resDate}`);
        return resDate;
    }

    public static getDifferenceInDays(start: number, end: number) {
        // console.log(` getDifferenceInDays(${start}, ${end})`);
    
        const MS_PER_DAY: number = 1000 * 60 * 60 * 24;
        const daysBetweenDates: number = Math.abs(Math.ceil((end - start) / MS_PER_DAY));
        console.log(` 123456789 : daysBetweenDates: ${daysBetweenDates}`);
    
        return daysBetweenDates;
    }

    public static getListOfDaysBetweenDates_Inclusive(start: number, end: number): Date[] {

        // const start = this.parseDateFromDbToNumber(dateFrom);
        // const end = this.parseDateFromDbToNumber(dateTo);

        const daysBetweenDates: number = Math.ceil((end - start) /this. MS_PER_DAY);

        const days: Date[] = Array.from(new Array(daysBetweenDates + 1), (v, i) => new Date(start + (i * this.MS_PER_DAY)));
        return days;
    }

    public static getNumberListOfDaysBetweenDates_Inclusive(start: number, end: number): number[] {

        // const start = this.parseDateFromDbToNumber(dateFrom);
        // const end = this.parseDateFromDbToNumber(dateTo);

        const daysBetweenDates: number = Math.ceil((end - start) /this. MS_PER_DAY);

        const days: number[] = Array.from(new Array(daysBetweenDates + 1), (v, i) => (start + (i * this.MS_PER_DAY)));
        return days;
    }
}