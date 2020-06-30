const R = require('ramda');

const computeValue=({pricePerBox, boxes, travel}) => pricePerBox * boxes / travel;

const transporter = {
    capital: 0,
    trucks: [],
}

const initTrucks = (nbOfTrucks) => {
    transporter.trucks = R.pipe(
        R.repeat({size: 20, busy: false}),
        R.addIndex(R.map)((element,index) => R.assoc('id',index,element))
    )(nbOfTrucks)
};

const isNotBusy = R.pipe(R.prop('busy'),R.equals(false));

const isFalse =bool => bool != false;

const affect = ({pricePerBox, boxes, travel},id) => {
    transporter.trucks[id].busy=true;
    setTimeout(deliver,travel*10,id,pricePerBox,boxes);
}

const deliver = (id,pricePerBox,boxes) => {
    transporter.trucks[id].busy=false;
    transporter.capital += pricePerBox*boxes;
}

const trucksHavePlace = (boxes) => {
    return R.filter(isFalse)
    (transporter.trucks
        .map ((elm) => {
            if (elm.size >= boxes) {
                return elm;
            }return false
        })
    )
}

const transporterHandler = ({pricePerBox, boxes, travel}) => {
    console.log({pricePerBox, boxes, travel});
    R.isEmpty(isNotBusy,trucksHavePlace(boxes)) ?
        affect({pricePerBox, boxes, travel},
            R.pipe(R.filter(isNotBusy),R.head)(trucksHavePlace(boxes)).id) :
        console.log("Can't Handle !!!");
    console.log(transporter.trucks);
    console.log(transporter.capital);
};

module.exports = {transporterHandler,initTrucks};