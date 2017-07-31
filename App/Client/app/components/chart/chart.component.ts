import { Component, Input } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html'
})

export class ChartComponent {

    chart = new Chart({
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: 'Messdaten'
        },
        credits: {
            enabled: false
        },
        series: []
    });

    addSerie(legendName: string, data: any) {
        this.chart.addSerie({
            name: legendName,
            data: data
        });
    }

}
