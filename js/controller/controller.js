import { DOM } from '../view/DOM.js';
import { Model } from '../model/model.js';
import { View } from '../view/view.js';


class Controller{

    constructor(model, view){
        this.model = model;
        this.view = view;
        
    }

    init(){
        //Scrolla al top
         window.scrollTo({ top: 0, behavior: 'smooth' });

        //Variabili 
        const dataOdierna =  DOM.elem.dailyDate; //seleziona la data
        const voceRichiesta = DOM.elem.selectedItem; //seleziona la voce richiesta
        const parent = DOM.elem.loaderContainer; //Punta al loader
        const formContainer = DOM.elem.formContainer;
        const modale = DOM.elem.modalForm;
        const btnGuida = DOM.elem.btnGuida;

        //Inizializza il data picker
        M.Datepicker.init(dataOdierna, {
            format:'yyyy-mm-dd',
            autoClose: true
        });

        // ******** INIZIALIZZAZIONE **************
        //Combo voci richieste
        M.FormSelect.init(voceRichiesta);
        this.view.changeColor();
       
        //Disalbilita i controlli
        this.view.displayControls(formContainer, true);

        //Modale della guida
        const istance = M.Modal.init(modale, {});

        //Pulsante della guida
        btnGuida.addEventListener('click', () => {
            istance.open();
        });
        // ********* FINE INIZIALIZZAZIONE *********


        //CONNESSIONE E SCARICO DATABASE IN LOCALE
        let database ;
        (async () => {
            await this.model.getAndSaveData('https://openpuglia.org/api/?q=getdatapccovid-19&mode=ts', parent).then(d => {
                //Memorizza il database scaricato dalla chiamata asincrona
                database = d;
                //Abilita i controlli
                this.view.displayControls(formContainer, false);
            })
        })();
        

        // *********** ADD LISTENERS ***********

        //Uso funzione freccia nella callback per usare this del parent
        dataOdierna.addEventListener('change', () =>  { 
            this.main(this.model, this.view, database, dataOdierna, voceRichiesta );
        });

        //Uso funzione freccia nella callback per usare this del parent
        voceRichiesta.addEventListener('change', () =>  {
            this.main(this.model, this.view, database, dataOdierna, voceRichiesta);
        });

    }

    main(_model, _view, db,  dataOdierna, voceRichiesta){
    
        //Variabili
        var style = getComputedStyle(document.body);

        //Verifica se il database esiste altrimenti esci
        if (typeof db === 'undefined') return;

        //Variabili
        const mappa_italia = DOM.elem.italyMap;

        //Inizializza le opzioni generali delle mappe
        Chart.defaults.global.defaultFontFamily = 'Lato';
        Chart.defaults.global.defaultFontColor = style.getPropertyValue('--black');
        Chart.defaults.global.defaultFontSize = 14;
        Chart.defaults.global.legend.display = false;

        //pulisce la mappa 
        mappa_italia.innerHTML = '';

        //pulisce i canvas e li  ricrea
        _view.cleanAndCreateCanvas();

        //Controlla campi input altrimenti esci
        if( dataOdierna.value !== "" && voceRichiesta.value !== "" ){

              //Ordina il database  in base alla data
              const dbOrd = _model.getDatabaseOrd(db, voceRichiesta.value, dataOdierna.value);
              //Aggiungiamo il codice regione esteso (es: "IT-XX" ricavati dalla mappa jvectormap)
              const dbEsteso = _model.getDatabaseRegionCodesExtended(dbOrd);
              //Se il database è vuoto , esci
              if( !dbEsteso.length ){
                return;
              }
              //Mette i colori nel database
              _model.putColorsInDB(dbEsteso, voceRichiesta.value);
              //Disegna il grafico a barre
              _view.drawBarChart(dbEsteso);
              //Colora la mappa d'italia e mette i valori delle quantità visualizzabili 
              //passando il mouse sulle regioni
              _view.putColorsItalyMap(dbEsteso);
              //Disegna il grafico al linee
              _view.drawLineChart(db, voceRichiesta.value);       
        }
    }
}

var App = new Controller(new Model(), new View())
App.init();




  