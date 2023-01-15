import EventEmitter from 'events';

// Формат даты ГГГГ-ММ-ДД чч:мм

let [date, time] = process.argv.splice(2);

let dateStart = new Date().getTime();
let dateEnd = new Date(`${date}T${time}`).getTime();

let emmitter = new EventEmitter();

emmitter.on('tick', (data) => {
    console.log(`Осталось - ${data.days} дней, ${data.hours} часов, ${data.minutes} минут, ${data.seconds} секунд`);
});
emmitter.on('stop', () => {
    console.log('Время вышло')
});
emmitter.on('start', () => {
    console.log('Таймер запущен')
});
emmitter.on('error', (message) => console.log(message));

class Timer{
    constructor(dateStart, dateEnd){
        this.dateStart = dateStart,
        this.dateEnd = dateEnd
    }
    checkCorrectDate(){
        if(this.dateStart > this.dateEnd){
            let message = 'Указанная дата меньше текущей';
            emmitter.emit('error', message);
        }
    }
    check(){
        if(this.dateStart < this.dateEnd){
            return true;
        }
        return false;
    }
    start(){
        this.checkCorrectDate();
        if(this.check()){
            this.timer = setInterval(() => {
                this.dateStart = new Date().getTime();
                if(this.check()){
                    this.prepareData();
                } else {
                    this.stop();
                }
            }, 1000)
            emmitter.emit('start');
            this.prepareData();
        } 
    }
    stop(){
        if (this.timer) {
            clearInterval(this.timer);
            emmitter.emit('stop');
        }
    }
    prepareData(){
        let ms = this.dateEnd - this.dateStart;

        let data = {
            seconds: Math.floor((ms / 1000) % 60),
            minutes: Math.floor((ms / (1000 * 60)) % 60),
            hours: Math.floor((ms / (1000 * 60 * 60)) % 24),
            days: Math.floor(ms / (1000 * 60 * 60 * 24)),
        };

        emmitter.emit('tick', data);
    }
}

let timer = new Timer(dateStart, dateEnd);
timer.start();
