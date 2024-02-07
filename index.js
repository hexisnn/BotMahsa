const TelegramApi = require('node-telegram-bot-api')

const token = '6934750127:AAHEdn7LaqzDNzhNgXe7Jmao2XrUpILXGcc'

const bot = new TelegramApi(token, { polling: true })

const { gameOptions, againOptions } = require('./options')

const chats = {}

const startGame = async chatId => {
	await bot.sendMessage(
		chatId,
		'Бот загадывает цифру от 0 до 10, поробуй угадать'
	)
	const randomChoice = Math.floor(Math.random() * 10)
	chats[chatId] = randomChoice
	await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

function open() {
	bot.on('message', async msg => {
		const chatId = msg.chat.id
		const text = msg.text
		if (text === '/start') {
			await bot.sendSticker(
				chatId,
				'https://tlgrm.ru/_/stickers/be1/98c/be198cd5-121f-4f41-9cc0-e246df7c210d/8.webp'
			)
			return bot.sendMessage(chatId, `Добро Пожаловать, ${msg.from.username}`)
		}
		if (text === '/game') {
			return startGame(chatId)
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Ваш ник - ${msg.from.username}`)
		}
		return bot.sendMessage(chatId, 'Я вас не понимаю, попробуйте еще раз!')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		if (data === '/again') {
			return startGame(chatId)
		}
		if (data == chats[chatId]) {
			return await bot.sendMessage(chatId, 'Ура', againOptions)
		} else {
			await bot.sendMessage(
				chatId,
				`Ты проиграл, ${chats[chatId]}`,
				againOptions
			)
		}
	})
}

open()

bot.setMyCommands([
	{ command: '/start', description: 'Начальное приветствие' },
	{ command: '/info', description: 'Получить информацию о пользователе' },
	{ command: '/game', description: 'Игра угадай цифру' },
])
