<p align="center"> 
<img width="250" src="http://i.imgur.com/hJRc4E0.png" />
</p>

<p align="center"> 
A flux with no side effects
</p>


**What is mutex ?**
Mutex is an improved way of writing flux based apps. It draws inspiration from redux and favours the [ducks file structure](https://medium.com/@scbarrus/the-ducks-file-structure-for-redux-d63c41b7035c).

Unlike traditional flux, mutex doesn't have a dispatcher or action constants. The best way to see how mutex is faster from existing flux solutions is to consider the following comparison :

*In Flux/ Redux:*
We generally start with defining action type constants.
```js
// constants.js

export default {
	USER_LOGIN_SUCCESS: 'userLoginSuccess'
};
```
Then actions which are triggered by user or you (the developer).
```js
// actions/auth.js 

import {USER_LOGIN_SUCCESS} from 'constants';

export function login(username, password) {
	return (dispatch) => {
		api
			.post('http://app.dev/auth/login', {username, password})
			.then((res) => {
				dispatch({
					type: USER_LOGIN_SUCCESS,
					user: res.user,
					token: res.token
				});
			})
			.catch((errors) => {
				dispatch({
					type: 'user.loginError', //maybe you use strings instead of constants (because they are more convenient)
					errors
				});
			})
		;
	};
}
```

And finally have multiple stores listening for this action type :

```js
// stores/user.js

import {USER_LOGIN_SUCCESS} from 'constants';

export default reducer(state={}, action) {
	switch (action.type) {
		case USER_LOGIN_SUCCESS:
			return {...state, token: action.token}
	}
	return state;
}
```

```js
// stores/auth.js

import {USER_LOGIN_SUCCESS} from 'constants';
export default reducer(state={}, action) {
	switch (action.type) {
		case USER_LOGIN_SUCCESS:
			return {...state, user: action.user}
		case 'user.loginError':
			return {...state, userLoginErrors: action.errors}
	}
	return state;
}
```

Pretty neat huh. Conceptually this is fine and bullet proof, but in real world applications it's rarely the case where one type of action is listened to by multiple reducers.

We had to make 4 files just to accomplish a simple task, which is why new developers feel uncomfortable when getting used to redux/ flux and after old developers get used to this verbosity.

*The same can be accomplished in mutex as follows :*
```js
// modules/user.js
import store from 'mutex/store';
import authSuccess from 'modules/auth.js';

export function userLoginSuccess(res, state) {
	return {...state, user: res.user};
}

export function userLoginError(errors, state) {
	return {...state, userLoginErrors: errors};
}

export function login(username, password) {
	api
		.post('http://app.dev/auth/login', {username, password})
		.then((res) => {
			store.mutate(res, [userLoginSuccess, authSuccess])
		})
		.catch(errors => {
			store.mutate(errors, [userLoginError]);
		})
	;
}
```

```js
// modules/auth.js

export function authSuccess(res, state) {
	return {...state, token: res.token};
}

```
And that's it. 

**How it works ?**
Instead of dispatching a global action type to be received by all reducers, in mutex you explicitly define the mutations that have to be take place in response to an action. 

In the above example, we explicitly defined that `authSuccess` and `userLoginSuccess` mutations have to run in the case of successful login.

All mutations are pure functions and are injected with the global state object. The state is immutable here.


**Why mutex ?**

 - Mutex eliminates side effects. All actions are pure and don't need
   any thunks. Just use plane promises if you have to.
 - Instead of reducers, mutex has mutations. These are pure functions that transform the state based on a payload.
 - It reduces boiler plate. We don't have to specify action types and payloads.
 - It's faster because instead of calling all reducers when an action is dispatched, only relevant mutations are called.
 - It's easier to debug. Because of explicit declaration of mutations along with actions, you will always know which file to look at if anything goes wrong.

Mutex can be seamlessly inserted in place of redux. Just replace the `react-redux`'s `connect` HOC with `mutex/connect` HOC.

Also, did we tell you that instead of using React context and a provider, `mutex` uses it's own singleton `mutex/store`. This makes mocking and testing easier. Just user `mutex/mock-connect` instead of connect. More on this later.

**Middlewares**
TODO

**Inspiration behind this project**
React was a game changer. Flux was it's wingman. As a member of react community since its inception,
it's hard to imagine writing apps without the easy state management that redux (flux, mobx and others) provide.

But as all good things come marked with astericks *, redux too has its own problems :
- Side effects (it's hard to keep actions pure)
- Boilerplate
- Event system bulking up the thread

This project is an attempt to solve the above issues. It : 
- Completely removes any dependence on dispatcher
- Uses native promises to by pass side effects
- Is extendable with middlewares
- Cuts a load of boilerplate

**Sound's interesting ? Got feedback ?**
I'm trying to build this along with my work and would appreciate any help. You can always reach me at khuranashivek@outlook.com. 
