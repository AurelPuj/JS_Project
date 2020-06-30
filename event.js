const marketEvent = new (require('events').EventEmitter)();

const emitter_ = () => {
  marketEvent.emit('New Offer', {
    pricePerBox: Math.ceil(Math.random() * 10),
    boxes: Math.floor(Math.random() * 100),
    travel: Math.floor(Math.random() * 1000)
  });
};

const launchEmitter = () => {
  emitter_();
  setTimeout(launchEmitter, Math.random() * 10000);
};

module.exports = {launchEmitter, marketEvent};
