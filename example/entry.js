import home from './home.js'
import login from './login'
Promise.resolve().finally(()=>{
    console.log(home,login,1111)
})
console.log(home,login)
