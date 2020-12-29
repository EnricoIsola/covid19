export class DOM{
            constructor(){}

            static $ = id => document.getElementById(id);

            static elem = {
                main: this.$("main_container"),
                selectedItem: this.$("typeData"),
                dailyDate: this.$("datePicker"),
                italyMap: this.$("italyMapContainer"),
                barChartContainer: this.$("barChartContainer"),
                lineChartContainer: this.$("lineChartContainer"),
                loaderContainer: this.$("loaderContainer"),
                formContainer: this.$("formContainer"),
                modalForm: this.$("modalForm"),
                btnGuida: this.$("btnGuida")
            }

            static elementStrings = {
                barChart: 'myBarChart',
                lineChart: 'myLineChart',
                italyMap: '#italyMapContainer',
                chartjsTooltip: '.chartjs-tooltip',
                hiddenContainer: 'chartjs-hidden-iframe'
            } 

}