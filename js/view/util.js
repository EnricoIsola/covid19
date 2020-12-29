
export class UTIL{

    constructor(){}
    
    //Ritorna i numeri formattati con la virgola
    static numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //Sottrae giorni alla data odierna
    static subtract_Days(date,days) {
        const currentDate = date.getDate();
        date.setDate(currentDate - days);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    //Ottieni i codici regione estesi dalla mappa , passando i codici delle regioni
    //presenti nei dati della API openpuglia.org
    static getRegionCodes(cod){

      switch(cod){
            case '01':
              return 'IT-21';
            break;
            case '02':
              return 'IT-23';
            break;
            case '03':
              return 'IT-25';
            break;
            case '04':
              return '';
            break;
            case '05':
              return 'IT-34';
            break;
            case '06':
              return 'IT-36';
            break;
            case '07':
              return 'IT-42';
            break;
            case '08':
              return 'IT-45';
            break;
            case '09':
              return 'IT-52';
            break;
            case '10':
              return 'IT-55';
            break;
            case '11':
              return 'IT-57';
            break;
            case '12':
              return 'IT-62';
            break;
            case '13':
              return 'IT-65';
            break;
            case '14':
              return 'IT-67';
            break;
            case '15':
              return 'IT-72';
            break;
            case '16':
              return 'IT-75';
            break;
            case '17':
              return 'IT-77';
            break;
            case '18':
              return 'IT-78';
            break;
            case '19':
              return 'IT-82';
            break;
            case '20':
              return 'IT-88';
            break;
            case '21':
              return 'IT-32';
            break;
            case '22':
              return 'IT-32';
            break;
            }
    }
}