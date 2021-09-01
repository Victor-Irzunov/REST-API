new Vue({
	el: '#app',
	data() {
		return {
			isDark: true,
			show: true,
			todoTitle: '',
			todos: []
		}
	},
	created() {
		fetch('/api/todo', {
			method: 'get'
		})
			.then(res => res.json())
			.then(todos => {
				this.todos = todos
			})
	},
	methods: {
		addTodo() {
			const title = this.todoTitle.trim()          //todoTitle input
			if (!title) {
				return
			}
			console.log('JSON.stringify({ title }): ', JSON.stringify({ title }))
			fetch('/api/todo', {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title })
			})
				.then(res => res.json())                //fetch вернет нам
				.then(({ todo }) => {
					this.todos.push(todo)
					this.todoTitle = ''
				})
				.catch(e => console.log(e))
		},
		removeTodo(id) {
			fetch('/api/todo/' + id, {
				method: 'delete'
			})
				.then(() => {
					this.todos = this.todos.filter(t => t.id !== id)
				})
				.catch(error => console.log(error))
		},
		//++ изменение
		completeTodo(id) {
			fetch('/api/todo/' + id, {
				method: 'put',
				headers: { 'Content-Type': 'application/json' },        //headers описываем когда чтото перед на сервер
				body: JSON.stringify({ done: true })
			})
				.then(res => res.json())
				.then(({ todo }) => {                                    //ф-цию описыаю и забераю одно поле todo
					const idx = this.todos.findIndex(t => t.id === todo.id)
					this.todos[idx].updatedAt = todo.updatedAt
				})
				.catch(e => console.log('Витя ошибка: ', e, '---измнение------app'))
		}
	},
	filters: {
		capitalize(value) {
			return value.toString().charAt(0).toUpperCase() + value.slice(1)
		},
		date(value, withTime) {
			const options = {
				year: 'numeric',
				month: 'long',
				day: '2-digit'
			}

			if (withTime) {
				options.hour = '2-digit'
				options.minute = '2-digit'
				options.second = '2-digit'
			}
			return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
		}
	}
})