const createServer = require('./createServer'); // 👈 3

async function main() {
  // 👈 1
  // 👇 4
  try {
    const server = await createServer(); // 👈 5
    await server.start(); // 👈 5

    // 👇 6
    async function onClose() {
      await server.stop(); // 👈 6
      process.exit(0); // 👈 8
    }

    process.on('SIGTERM', onClose); // 👈 7
    process.on('SIGQUIT', onClose); // 👈 7
  } catch (error) {
    console.error(error); // 👈 4
    process.exit(-1); // 👈 4
  }
}
main(); // 👈 2
