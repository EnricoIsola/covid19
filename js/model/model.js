import  { UTIL }  from '../view/util.js';

export class Model{
    
    constructor(){
        //
    }

    // **** CONNESSIONE *********
    async getAndSaveData (url, parent){
        try{
            let response = await fetch(url, {
                cache: 'default' //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            });
            let database = await response.json();
            return database;
        }catch(error){
            console.log("Si è verificato un errore!");
        }finally{
                //Cancella il loader
                this.clearLoader(parent); 
        }
    }

    //Cancella il loader
    clearLoader(parent){
        if (parent.firstChild) {
            parent.innerHTML = '';
        }
    }

    //Ordina il database in base alla data
    getDatabaseOrd(db, tipo, data){
        let newDb = [];
        db.forEach(function(value){
            if(value.data == data){
              newDb.push({codRegione:value["codice regione"], nomeRegione:value.regione, qta:value[tipo]});
            }
        });
        //Ordina l'array
        let ordDb = newDb.sort(function (n1, n2) {
            return ((n1.qta > n2.qta) ? -1 : ((n1.qta < n2.qta) ? 1 : 0));
        });
        return ordDb;
    }

    //Ricava database con il codice regione esteso es "IT-25"
    //I vari settori della mappa sono contrasegnati da un id nel formato "IT-XX"
    getDatabaseRegionCodesExtended(db){
        let newDb = [];
        db.forEach(function(value){
            newDb.push({codRegione:value.codRegione, codRegione2: UTIL.getRegionCodes(value.codRegione) , nomeRegione:value.nomeRegione, qta:value.qta});
        });
        return newDb;
    }

    //Mette i colori nella mappa
    putColorsInDB(db, tipo){
        let maxVal = db[0].qta;
        let h = 0;
        let a,b,c;
        if (tipo === 'dimessi guariti'){
          a=0, b=166, c=255;
        }else if (tipo === 'tamponi'){
          a=2, b=207, c=101;
        }else{
          a=500, b=0, c=0;
        }
        db.forEach(function(value){
                h = (value.qta / maxVal) - 0.00001
                value.codColor = `rgba(${a}, ${b}, ${c}, ${h})`;
        });
    }

}




