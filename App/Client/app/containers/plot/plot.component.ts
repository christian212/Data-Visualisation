import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
    templateUrl: './plot.component.html'
})

export class PlotComponent {
    chart = new Chart({
        chart: {
            type: 'line',
            zoomType: 'x'
        },
        title: {
            text: 'Linechart'
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Line 1',
            data: [1, 2, 3, 2, 2, 5, 8, 5, 4, 1]
        }]
    });

    // add point to chart serie
    add() {
        this.chart.addPoint(Math.floor(Math.random() * 10));
    }
}