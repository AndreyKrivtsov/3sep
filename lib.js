function getSpeed(time, count, batch) {
    let speed = count / time * batch
    let averageTime = time / count
    return {speed, averageTime}
}

function print(count, speed, total, average) {
    console.log('Перевернул календарь %s раз.', count)
    console.log('Скорость: ~%s/сек.', speed.toFixed(2))
    console.log('Всего перевернуто: %s раз.', total)
    console.log('Среднее время переворачивания: %s мс. \n\n', average.toFixed(4))
}