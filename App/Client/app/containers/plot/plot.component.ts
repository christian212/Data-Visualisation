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

        var a = [];

        for (let i = 0; i < 20; ++i) {
            a[i] = i;
        }

        // http://stackoverflow.com/questions/962802#962890
        function shuffle(array) {
            let tmp, current, top = array.length;
            if (top) while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        }

        a = shuffle(a);


        this.chart.addSerie({
            name: 'Line 1',
            data: a
        });
    }
}
