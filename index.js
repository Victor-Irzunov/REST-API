const express = require('express')
const todoRoutes = require('./routes/todo')
const sequelize = require('./utils/database')
const chalk = require('chalk')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000


app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())                         //парсить json файлы 
app.use('/api/todo', todoRoutes)            ///api - отсылать иммено по адресу api (служит для отдачи каих-либо данных, в нашем случае json)

app.use((req, res, next) => {
	res.sendFile(__dirname + "/index.html")    //вызвать один файл
})

async function start() {
	try {
		await sequelize.sync()           //force: true перетирать 

		app.listen(PORT, () => console.log(chalk.cyan('------------Запущено-----------')))

	}
	catch (error) {
		console.log(chalk.red('Витя ошибка:', error, '---------index start()'))
	}
}

start()


