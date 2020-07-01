const R = require('ramda');


const MIN_PROFIT = 0.1; // profit minimum pour accepter une commande
const MAX_TRUCKS = 4; // nombre maximum de camion

// list des camions disponibles
const shop = [
    {size:40, price:200, cons:0.01,  busy:false},
    {size:80, price:500, cons:0.015, busy:false},
]

const transporter = {
    capital: 0,
    trucks: [],
}

const initTrucks = (nbOfTrucks) => {
    transporter.trucks = R.pipe(
        R.repeat(shop[0]),
        R.addIndex(R.map)((element,index) => R.assoc('id',index,element)),
    )(nbOfTrucks)

    console.log(transporter.trucks);
};


const isBasicTruck = R.pipe(R.prop('size'),R.equals(shop[0].size));
const isNotBusy = R.pipe(R.prop('busy'),R.equals(false));
const isFalse = bool => bool != false;

// prend en charge une commande
const affect = ({pricePerBox, boxes, travel},id) => {
    transporter.trucks[id].busy=true;
    setTimeout(deliver,travel*10,id,pricePerBox,boxes,travel);
    console.log("Commande pris en charge");
}


// calcule le profit on fonction d'un commande et de la consomation du camion
const profit = ({pricePerBox, boxes, travel}, cons) => (pricePerBox * boxes - cons * travel) / travel; //CHANGER


// verifie que le profit est suffisant
const checkProfit = ({pricePerBox, boxes, travel},id) => {
    profit({pricePerBox, boxes, travel}, transporter.trucks[id].cons) >= MIN_PROFIT ?
        affect({pricePerBox, boxes, travel},id):
        console.log("Profit insuffisant...");
}

// termine une commande
const deliver = (id,pricePerBox,boxes,travel) => {
    transporter.trucks[id].busy = false;
    transporter.capital += pricePerBox*boxes - transporter.trucks[id].cons * travel ;
    console.log("\n\nCommande livrée");
    console.log("Capital : " + transporter.capital);
    transporter.trucks.length < MAX_TRUCKS ? buyTruck() : upgradeTruck();
}

// Essaie d'acheter un camion
const buyTruck=() => {

    transporter.capital >= shop[0].price && (
        transporter.trucks.push(R.assoc('id',transporter.trucks.length,shop[0])),
            transporter.capital -= shop[0].price,
            console.log("\n\nAchat d'un nouveau camion !\nCapital : " + transporter.capital),
            console.log(transporter.trucks),
            buyTruck()
    );
/*
    if(transporter.capital >= shop[0].price){
        let truck = Object.assign({}, shop[0]);
        truck["id"] =  transporter.trucks.length;
        transporter.trucks.push(truck);

        transporter.capital -= shop[0].price;
        console.log("Achat d'un nouveau camion !");
        console.log("Capital : " + transporter.capital);
        console.log(transporter.trucks);
    }
*/
}

const sortTrucks = (a, b) => { return a.size - b.size; };

// Essaie d'améliorer un camion
const upgradeTruck = () => {
    (!R.isEmpty(R.filter(isBasicTruck,transporter.trucks)) && transporter.capital >= shop[1].price - shop[0].price) &&
    (transporter.trucks[R.pipe(R.sort(sortTrucks),R.head)(transporter.trucks).id] =
        R.assoc('id',R.pipe(R.sort(sortTrucks),R.head)(transporter.trucks).id,shop[1]),
        transporter.capital -= shop[1].price - shop[0].price,
        console.log("\n\nAmélioration Effectué ! \nCapital : " + transporter.capital),
        console.log(transporter.trucks),
        upgradeTruck()
    );
/*
    if(transporter.capital >= shop[1].price - shop[0].price &&
        !R.isEmpty(R.filter(isBasicTruck,transporter.trucks))){

        let truck = R.pipe(R.filter(isBasicTruck),R.head)(transporter.trucks);
        truck["size"]  = shop[1].size;
        truck["price"] = shop[1].price;
        truck["cons"]  = shop[1].cons;

        transporter.capital -= shop[1].price - shop[0].price;
        console.log("Amélioration du camion "+truck["id"]+" !");
        console.log("Capital : " + transporter.capital);
        console.log(transporter.trucks);
    }
*/
}


// renvoie la liste des camions qui ont suffisament de place pour comptenir toutes les boites
const trucksHavePlace = (boxes) => {
    return R.filter(isFalse)
    (transporter.trucks
        .map ((elm) => {
            return elm.size >= boxes ? elm : false ;
        })
    )
}

// Essaie de prendre en charge une commande
const transporterHandler = ({pricePerBox, boxes, travel}) => {
    console.log("\n\n--- NOUVELLE COMMANDE ---");
    console.log({pricePerBox, boxes, travel});
    R.isEmpty(R.filter(isNotBusy,trucksHavePlace(boxes))) ?
        console.log("Aucun camion disponible capable de prendre en charge cette commande...") :
        checkProfit({pricePerBox, boxes, travel}, R.pipe(R.filter(isNotBusy),R.head)(trucksHavePlace(boxes,transporter.trucks)).id);
};


module.exports = {transporterHandler,initTrucks};
