import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-double-line-chart',
    templateUrl: './double-line-chart.component.html',
    styleUrls: ['./double-line-chart.component.scss']
})
export class DoubleLineChartComponent implements AfterViewInit {
    @ViewChild('doubleLineCanvas') doubleLineCanvas: ElementRef;
    doubleLineChart: any;

    // @ViewChild('bidonLoad') bidonLoad: ElementRef;

    @Input()
    chart_label: string[];

    @Input()
    chart_line_label: string[];

    @Input()
    chart_first_line_value: number[];

    @Input()
    chart_second_line_value: number[];

    constructor() { }

    ngAfterViewInit(): void {
        this.doubleLineChartMethod();
    }

    doubleLineChartMethod(): void {

        console.log(` ..................... > ${this.chart_label}`);

        // while(this.chart_label?.length < 1) {
        //     this.delay(50);
        //     console.log(`I sleeped !`);
        // }

        this.doubleLineChart = new Chart(this.doubleLineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.chart_label,
                datasets: [
                    {
                        label: this.chart_line_label[0],
                        data: this.chart_first_line_value,
                        backgroundColor: "rgba(40,125,200,.5)",
                        borderColor: "rgb(40,100,200)",
                        fill: true,
                    },
                    {
                        label: this.chart_line_label[1],
                        data: this.chart_second_line_value,
                        backgroundColor: "rgba(240,78,71,.5)",
                        borderColor: "rgb(240,78,71)",
                        fill: true,
                    }
                ]
            },

            options: {
                responsive: true,
                // title: {
                //     display: true,
                //     position: "top",
                //     text: "Facebook to Instagram - Social Networking",
                //     fontSize: 12,
                //     fontColor: "#666"
                // },
                // legend: {
                //     display: true,
                //     position: "bottom",
                //     labels: {
                //         fontColor: "#999",
                //         fontSize: 14
                //     }
                // }
            }
        })
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}