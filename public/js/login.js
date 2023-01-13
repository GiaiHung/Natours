/* eslint-disable */
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')

const hideAlert = () => {
  const el = document.querySelector('.alert')
  if (el) el.parentElement.removeChild(el)
}

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert()
  const markup = `<div class="alert alert--${type}">${msg}</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
  window.setTimeout(hideAlert, 5000)
}

async function login(email, password) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/v1/auth/login',
      data: {
        email,
        password,
      },
    })

    if (res.status === 200) {
      window.setTimeout(() => {
        showAlert('success', 'Logged in successfully!')
        location.assign('/')
      }, 500)
    }
  } catch (error) {
    showAlert('error', error.response.data.message)
  }
}

async function logout() {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:5000/api/v1/auth/logout',
    })

    if (res.status === 200) location.reload(true)
  } catch (error) {
    showAlert('error', 'Error logging out')
  }
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', function (e) {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    login(email, password)
  })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout)
