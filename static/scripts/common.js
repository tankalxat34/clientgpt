/**
 * Заменяет подстроки из первого массива на подстроки из второго массива. Возвращает новую строку
 * @param str исходная строка
 * @param first_array подстроки что заменяем
 * @param second_array подстроки на что заменяем
 * @returns {String}
 */
function translateString(str, first_array, second_array) {
    let result = str;
    for (let i = 0; i < first_array.length; i++) {
        let counter = 0;
        while (result.indexOf(first_array[i]) !== -1) {
            counter++;
            result = result.replace(first_array[i], second_array[i]);
            if (counter >= 1000) break
        }
    }
    return result
}