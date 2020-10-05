// const baseUrl = "http://localhost:4000/api"
const baseUrl = `https://taskify-backend.herokuapp.com/api`

const config = function () {
    let token
    if (localStorage.token) {
        token = localStorage.token
    }
    if (!token) {
        return {
            url: baseUrl,
            headers: { 
                'Content-Type': 'application/json'
            },
        }
    } else {
        return {
            url: baseUrl,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
    }
}

export default config