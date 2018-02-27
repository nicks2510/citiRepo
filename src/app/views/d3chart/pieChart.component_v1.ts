import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'pieChart',
    template: `<div class="d3-chart"  #chart></div>`,
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit, OnChanges {
    @ViewChild('chart') private chartContainer: ElementRef;
    @Input() private data: Array<any>;
    private margin: any = { top: 20, bottom: 20, left: 40, right: 20};
    private chart: any;
    private width: number;
    private height: number;
    private radius:number;
    private outerRadius:number;
    private innerRadius:number;
    private donutWidth:number;
    private host: d3.Selection;
    private svg: d3.Selection;
    private htmlElement: HTMLElement;
    constructor() { }
  
    ngOnInit() {
       if (this.data) {
       this.setup();
       this.buildSVG();
       this.buildPie();
      }
    }
  
    ngOnChanges() {
      if (this.data) {
        this.setup();
        this.buildSVG();
        this.buildPie();
       }
    }
    
    private setup(): void {
        this.width = 35;
        this.height = 35;
        this.radius = Math.min(this.width, this.height) / 2;
        this.htmlElement = this.chartContainer.nativeElement;
        this.host = d3.select(this.htmlElement);
    }

    private buildSVG(): void {
        this.data = [
            {
              label: "data1",
              value: 1,
              color: 'red'
            },
            {
              label: "data2",
              value: 2,
              color: 'green'
            },
            {
              label: "data3",
              value: 3,
              color: 'blue'
            },
            {
              label: "data4",
              value: 4,
              color: 'megenda'
            }
          ];
        this.host.html("");
        this.svg = this.host.append("svg")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .append("g")
            .attr("transform", `translate(${this.width / 2},${this.height / 3.5})`);
    }

    private buildPie(): void {
        let pie = d3.layout.pie();
        let values = this.data.map(data => data.value);
        
        let arcSelection = this.svg.selectAll(".arc")
            .data(pie(values))
            .enter()
            .append("g")
            .attr("class", "arc");

        this.populatePie(arcSelection);
    }

    private populatePie(arcSelection: d3.Selection<d3.layout.pie.Arc>): void {
        let innerRadius = this.radius - 50;
        let outerRadius = this.radius - 10;
        //let  pieColor= d3.scale.category20c();
        let pieColor = this.data.map(data => data.color);
        let arc = d3.svg.arc<d3.layout.pie.Arc>()
            .outerRadius(outerRadius);
        arcSelection.append("path")
            .attr("d", arc)
            .attr("fill", (datum, index) => {
                return pieColor[index];
            });

        /*arcSelection.append("text")
            .attr("transform", (datum: any) => {
                datum.innerRadius = 0;
                datum.outerRadius = outerRadius;
                return "translate(" + arc.centroid(datum) + ")";
            })
            .text((datum, index) => this.data[index].name)
            .style("text-anchor", "middle");*/
    }
    
}
