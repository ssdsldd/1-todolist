import { v1 } from "uuid"
// import { TodolistDomainType, addTodolistAC, changeFilterAC, editTodolistTitleAC, filterType, removeTodolistAC, todolistsReducer } from "./todolists-reducer"

// let todolistId1: string
// let todolistId2: string
// let startState:TodolistDomainType[]
// beforeEach(()=> {
//     todolistId1 = v1()
//     todolistId2 = v1()
//     startState = [
//         { id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
//         { id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0 }
//     ]
// })

// test('correct todolist should be removed', () => {
//     const newTodolist = todolistsReducer(startState, removeTodolistAC(todolistId1))
//     expect(newTodolist.length).toBe(1)
//     expect(newTodolist[0].id).toBe(todolistId2)
// });

// test('correct todolist should be added', () => {
//     let newTodolistTitle = 'New Todolist'
//     const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle))

//     expect(endState.length).toBe(3)
//     expect(endState[2].title).toBe(newTodolistTitle)
// })

// test('correct filter of todolist should be changed', () => {
//     let newFilter: filterType = 'completed'

//     const endState = todolistsReducer(startState, changeFilterAC(newFilter, todolistId2))

//     expect(endState[0].filter).toBe('all')
//     expect(endState[1].filter).toBe(newFilter)
// })

// test('correct todolist should change its name', () => {

//     let newTodolistTitle = 'New Todolist'

//     const endState = todolistsReducer(startState, editTodolistTitleAC(newTodolistTitle, todolistId2))

//     expect(endState[0].title).toBe('What to learn')
//     expect(endState[1].title).toBe(newTodolistTitle)
// })