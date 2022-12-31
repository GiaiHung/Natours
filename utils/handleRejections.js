const handleRejection = () => {
  // Global handle rejected promise
  process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message)
    // Close the server first, then shut down the application
    process.exit(1) // 0: Success, 1: Uncaught exception
  })
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.log(error.name, error.message)
    // Close the server first, then shut down the application
    process.exit(1) // 0: Success, 1: Uncaught exception
  })
}

module.exports = handleRejection
