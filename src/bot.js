import {Telegraf} from 'telegraf';
import db from './db';



const BOT_TOKEN = '2029552408:AAGDRZEx0YXyT2j7tkISeSIEeysZKmKcLj8'

if (!BOT_TOKEN) throw new Error('"BOT_TOKEN" env var is required!')

const bot = new Telegraf(BOT_TOKEN)

bot.on('text', (ctx) => {

    // сообщение
    const { message } = ctx.update;
    
    // пользователь
    const user = ctx.update.message.from;

    console.log(`\nUSER ID: ${user.id}\n`)

    // текст сообщения
    const { text } = message;

    // все данные и whitelist пользователей бота)
    const { botUserAvailablePaths, pass, botUserWhiteList } = db.get('/')

    if (!botUserWhiteList.includes(user.id)) {
        ctx.reply('Тебе сюда нельзя! Дружок пирожок')
        return;
    }

    /**
     * доступные пользователю роуты
     */
    const availablePaths = botUserAvailablePaths[user.id];

    /**
     * сливаем все доступные пользователю роуты в один
     */
    let allAvailablePassData = '';
    
    availablePaths.forEach(path => {
        allAvailablePassData += `\n\n${pass[path]}`;
    })

    // для возврата всех данных
    if (text.toLowerCase() === 'all') {
        ctx.reply(allAvailablePassData);
        return;
    }

    // для возврата других данных из БД
    if (text[0] === '/') {
        ctx.reply(db.get(text));
        return;
    }

    /**
     * находим среди всех паролей нужные
     */
    const splittedPass = allAvailablePassData.split('\n\n');
    
    let suitablePass = '';

    splittedPass.forEach(el => {
        if (el.trim().toLowerCase().includes(text.trim().toLowerCase())) {
            suitablePass += `${el}\n\n`
        }
    });  
    
    suitablePass ? ctx.reply(suitablePass) : ctx.reply('Nothing')
    return;
})

//bot.launch()


const SECRET_PATH = `/telegraf/${bot.secretPathComponent()}`

export { bot, SECRET_PATH }