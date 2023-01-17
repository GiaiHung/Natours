/* eslint-disable */
const stripe = Stripe(
  'pk_test_51MQrTdAavLUEz4zBRTvEAiJcXs8rLqMR4Hx6Hj43xFsjeubsAdltuLwkVo0ezkj1dj3rxwkhan6I6gbhECHTZRJu00Tl9griQP'
)
const bookTourBtn = document.getElementById('book-tour')

const bookTour = async (tourId) => {
  try {
    // 1) Get check out session from API
    const session = await axios(
      `http://localhost:5000/api/v1/bookings/checkout-session/${tourId}`
    )

    // 2) Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    })
  } catch (error) {
    console.log(error)
    showAlert('error', error)
  }
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...'
    // data set will automatically convert to camel case instead of tour-id
    const { tourId } = e.target.dataset
    await bookTour(tourId)
  })
}
