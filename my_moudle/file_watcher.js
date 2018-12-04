const Watcher = require('./Watcher')
const fs = require('fs')

const [nodePath, scriptPath, watchDir, processedDir] = process.argv
const watcher = new Watcher(watchDir, processedDir)

watcher.on('process', (file) => {
    const watchFile = `${watchDir}/${file}`
    const processedFile = `${processedDir}/${file.toLowerCase()}`
    fs.rename(watchFile, processedFile, err => {
        if (err) throw err
    })
})

watcher.start()