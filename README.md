![mutex Logo](http://i.imgur.com/4dvJqcp.png)
# mutex
## A flux with no side effects

React was a game changer. Flux was it's wingman. As a member of react community since its inception,
it's hard to imagine writing apps without the easy state management that redux (flux, mobx and others) provide.

But as all good things come marked with astericks *, redux too has its own problems :
- Side effects (it's hard to keep actions pure)
- Boilerplate
- Event system bulking up the thread
- And more boilerplate

This project is an attempt to solve the above issues. It : 
- Completely removes any dependence on dispatcher
- Uses native promises to by pass side effects
- Is extendable with middlewares
- Cuts a load of boilerplate

## Idea
- Assume a starting state of the app. 
- Every action (taken by user or the app) causes a mutation to the state. 
- All actions cause some mutations (otherwise, they are useless).
- In redux, we dispatch an action with a type and hope that someone might listen to it.
- In mutex, we tell explicity, the mutations, that need to run.

## Implementation
- Your app now need to have two extra folders : actions and mutations
- All actions explicitly call required mutations