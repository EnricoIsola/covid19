
import { DOM } from './DOM.js';
import  { UTIL }  from './util.js';

export class View{

    constructor(){}

    //Abilita, disabilita i controlli
    displayControls(frmControl, boolValue){
        if(boolValue === true){
            frmControl.style.display = "none";
        }else{
            frmControl.style.display = "block";
        }
    }

    //Pulisce i vanvas
    cleanAndCreateCanvas(){  
        //Variabili
        const tempBarChart = DOM.elementStrings.barChart;
        const tempLineChart = DOM.elementStrings.lineChart;
        const tempBarChartContainer = DOM.elem.barChartContainer;
        const tempLineChartContainer = DOM.elem.lineChartContainer;
        const tempHiddenContainer = DOM.elementStrings.hiddenContainer;

        //Cancella le barre
        const barChart = document.getElementById(tempBarChart);
        if(barChart)  barChart.parentElement.removeChild(barChart);
        const lineChart = document.getElementById(tempLineChart);
        if(lineChart)  lineChart.parentElement.removeChild(lineChart);
        
        //Pulisce i canvas 
        const hiddenContainer = document.getElementsByClassName(tempHiddenContainer);
        if (hiddenContainer.length > 0) Array.from(hiddenContainer).forEach(el => el.remove());
        //Ricrea le barre
        tempBarChartContainer.insertAdjacentHTML('afterbegin', `<canvas id='${tempBarChart}'></canvas>`);
        tempLineChartContainer.insertAdjacentHTML('afterbegin', `<canvas id='${tempLineChart}'></canvas>`);
    }
    

    //Disegna il grafico a barre
    drawBarChart(db){

        //Variabili
        const tempBarChart = DOM.elementStrings.barChart;
        const style = getComputedStyle(document.body);

        //Etichette
        const labels = db.map(function(elem){
            return elem.nomeRegione;
        });

        //Valori
        const dates = db.map(function(elem){
            return elem.qta;
        });

        //Colori
        const colors = db.map(function(elem){
            return elem.codColor;
        });

        //Totale generale
        let totGenerale = 0;
        db.forEach(function(elem){
            totGenerale += parseInt(elem.qta)
        });

        //punta al canvas
        const barChart = document.getElementById(tempBarChart);
        const myChart = barChart.getContext('2d');

        //Define chart
        const massPopChart = new Chart(myChart, {
              type:'horizontalBar',
              data: {
                  labels: labels,
                  datasets: [{
                      data: dates,
                      backgroundColor: colors,
                      borderWidth:1,
                      borderColor:'#777',
                      // hoverBorderWidth:3,
                      // hoverBorderColor:'#000'
                  }]
              },
              options: {
                maintainAspectRatio: false,
                responsive:true,
                    title: {
                        display: true,
                        fontColor: style.getPropertyValue('--black'),
                        text: `Totale Italia:  ${UTIL.numberWithCommas(totGenerale)}`
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                // Include a dollar sign in the ticks
                                    callback: function(value) {
                                          return UTIL.numberWithCommas(value);
                                  }
                              }
                        }]
                  },
                    tooltips: {                             
                      callbacks: {
                                label: function(tooltipItem, data) {
                                    return UTIL.numberWithCommas(tooltipItem.xLabel);
                                }
                      }
                    },
                
              },
              layout: {
                padding:{
                    left:2,
                    right:2,
                    bottom:0,
                    top:0
                    }
              },
              tooltips: {
                enable:true
              }     
        });
        
    }


    //Disegna il grafico a linee
    drawLineChart(db, tipo){

        //Variabili
        const tempLineChart = DOM.elementStrings.lineChart;
        var style = getComputedStyle(document.body);

        var labels = []; //Array date
        //--------------------------------
        db.forEach(function(el){
            if(labels.indexOf(el.data) === -1) labels.push(el.data); 
        });

        var dates = []; // Array quantità
        //--------------------------------
        labels.forEach(function(elem) {
                var num = 0;
                db.forEach(function(el){
                      if (el.data === elem){
                        num += parseInt(el[`${tipo}`]);
                      }
                  });
                  
                  dates.push(num);        
        });
        
        var formattedDate = labels.map(function(el){
              var a = el.split('-');
              return `${a[2]}-${a[1]}-${a[0]}`;
        })
        
        //punta al canvas
        const lineChart = document.getElementById(tempLineChart);
        const myChart = lineChart.getContext('2d');

        //Define chart
        var massPopChart = new Chart(myChart, {
                  type:'line',
                  data: {
                      labels: formattedDate,
                      datasets: [{
                          // label:'Daily report',
                          data: dates,
                          backgroundColor: 'transparent',
                          borderColor: style.getPropertyValue('--grey'),
                          borderWidth: 1,
                          pointRadius: 1,
                          pointHoverRadius: 10,
                          pointHoverBorderWidth: 2
                          
                      }]
                  },
                  options: {
                        maintainAspectRatio: false,
                        responsive:true,
                        title: {
                            display: true,
                            fontColor: style.getPropertyValue('--black'),
                            text: `Andamento - ${tipo} - dal 24-2-2020`
                        },
                        scales: {
                              yAxes: [{
                                  ticks: {
                                      // Include a dollar sign in the ticks
                                          callback: function(value) {
                                                return UTIL.numberWithCommas(value);
                                        }
                                    }
                              }]
                        },
                        tooltips: {                             
                          enabled: false,
                          mode: 'index',
                          intersect: false,
                          custom: this.customTooltips
                        }
                  },
                  layout: {
                    padding:{
                        left:2,
                        right:2,
                        bottom:0,
                        top:0
                        }
                  }  
            });

    }

    

    putColorsItalyMap(db) {
        console.log(db)
        //Variabili
        const italyMap = DOM.elementStrings.italyMap;
        
        // ---- Crea l'array colori da mettere nelle regioni ---
        let objColor ='';
        objColor += '{'
        db.forEach(function(v){
            objColor += `"${v.codRegione2}":"${v.codColor}",`
        });
        objColor += '}'
        const newObj = JSON.parse(objColor.replace(/,}/g,"}"));


        // Crea l'array data
        const objData = db.map(el => el.qta);
        // ---------------

        
        $(italyMap).vectorMap({map: 'it_regions_merc',
                                    backgroundColor: 'transparent',
                                    borderColor:'#000',
                                    zoomButtons : false,
                                    zoomOnScroll: false,
                                    enableDrag:false,
                                    showTooltip:false,

                                    series: {
                                                regions: [{
                                                    values: newObj
                                                }]
                                            },
                                    regionStyle: {
                                                initial: {
                                                    stroke: "black",
                                                    "stroke-width": 1,
                                                    "stroke-opacity": 1
                                                }
                                            },
                                    labels:
                                        {
                                            regions:
                                            {
                                                render: function (code)
                                                {
                                                    // return code;
                                                    // myArray.find(x => x.id === '45').foo;
                                                    //return UTIL.numberWithCommas(db.find(x => x.codRegione2 === code).qta);
                                                    
                                                }
                                            }
                                        },
                                        onRegionOver: function(e, code){
                                        // el.html(el.html()+' (GDP - '+gdpData[code]+')');
                                        // return  e  + " " + el + " " + code
                                        // return UTIL.numberWithCommas(db.find(x => x.codRegione2 === code).qta);
                                        
                                       },
                                       onRegionTipShow: function(e, el, code){
                                        el.html(el.html() + ': ' + UTIL.numberWithCommas(db.find(x => x.codRegione2 === code).qta));
                                      }
                                            
        });
    }

    customTooltips (tooltip) {
        //Variabili
        const tempChartjsTooltip = DOM.elementStrings.chartjsTooltip;
        const style = getComputedStyle(document.body);

        // $(this._chart.canvas).css('cursor', 'auto');
        // var positionY = this._chart.canvas.offsetTop;
        const positionX = this._chart.canvas.offsetLeft;
        const pos_x = (this._chart.canvas.scrollWidth) / 2 ;

        const tip = document.querySelector(tempChartjsTooltip);
        tip.style.opacity = 0;

        // $('.chartjs-tooltip').css({
        //     opacity: 0,
        // });

            if (!tooltip || !tooltip.opacity) {
            return;
        }

        if (tooltip.dataPoints.length > 0) {
            tooltip.dataPoints.forEach(function(dataPoint) {
            const content = [dataPoint.xLabel + ': &nbsp;' , `<span style='border: 1px solid black; padding: 2px 15px' >${UTIL.numberWithCommas(dataPoint.yLabel)}</span>`].join('');
            // var $tooltip = $('#tooltip-' + dataPoint.datasetIndex);
            const $tooltip = document.getElementById('tooltip-' + dataPoint.datasetIndex);
            // $tooltip.html(content);
            $tooltip.innerHTML = content;
                    // $tooltip.css({
                    //     opacity: 1,
                    //     // top: positionY + dataPoint.y + 'px',
                    //     // left: positionX + dataPoint.x + 'px',
                    //     left: positionX + pos_x + 'px',
                    //     top: 50,
                    //     color: style.getPropertyValue('--grey'),
                    //     "font-weight": "bold",
                    //     "font-size": "1.3em",
                    //     "background": "transparent"
                    // });

                    const c = $tooltip.style;
                    c.opacity =1;
                    c.left = positionX + pos_x + 'px';
                    c.top = 50 + 'px';
                    c.color = style.getPropertyValue('--grey');
                    c.fontWeight = 'bold';
                    c.fontSize = '1.3em';
                    c.backgroundColor = "transparent";
            });
        }
    };

    //Cambia colori alle voci del combo voci richieste (Select item..)
    changeColor(){
        var options_elem = document.querySelectorAll(".dropdown-content li>a, .dropdown-content li>span");
        
        //index==0 is the disabled option element
        options_elem.forEach(function(element, index){
          switch(index){
            case 10:
              element.classList.add("blue-text","text-darken-4", "font_bold", "border_item");
            break;
             case 11:
             case 12:
              element.classList.add("red-text","text-darken-2", "font_bold", "border_item");
            break;
             case 15:
              element.classList.add("teal-text","text-darken-2", "font_bold", "border_item");
            break;
             default:
              element.classList.add("black-text","text-darken-2");
          }
        });
      }

}


