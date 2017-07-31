import { Component, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html'
})

export class ChartComponent {

    chart: any;

    addSerie(legendName: string, data: any) {

        this.chart = new Chart({
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: 'Messdaten'
            },
            xAxis: {
                type: 'datetime'
            },
            credits: {
                enabled: false
            },
            series: data
        });

    }

}
