/* eslint-disable */
const formUserData = document.querySelector('.form-user-data')
const formUserPassword = document.querySelector('.form-user-password')
const savePasswordBtn = document.querySelector('.btn--save-password')

async function updateSettings(type, data) {
  try {
    // 2 type: data and password
    const url =
      type === 'password'
        ? 'http://localhost:5000/api/v1/auth/updatePassword'
        : 'http://localhost:5000/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    })
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
    }
  } catch (error) {
    showAlert('error', error.response.data.message)
  }
}

if (formUserData) {
  formUserData.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    await updateSettings('data', { name, email })
    location.reload(true)
  })
}
if (formUserPassword) {
  formUserPassword.addEventListener('submit', async (e) => {
    e.preventDefault()
    savePasswordBtn.textContent = 'Updating...'
    const oldPassword = document.getElementById('password-current').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('password-confirm').value
    await updateSettings('password', { oldPassword, password, passwordConfirm })

    document.getElementById('password-current').value = ''
    document.getElementById('password').value = ''
    document.getElementById('password-confirm').value = ''
    savePasswordBtn.textContent = 'Save password'
  })
}
