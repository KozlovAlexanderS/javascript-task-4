'use strict';

exports.isStar = false;

var FUNCTION_PRIORITY = ['filterIn', 'sortBy', 'select', 'limit', 'format'];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */

exports.query = function (collection) {
    var functions = [].slice.call(arguments, 1);
    var changedCollection = collection.map(function (el) {
        return Object.assign({}, el);
    });
    functions.sort(function (first, second) {
        return FUNCTION_PRIORITY.indexOf(first.name) - FUNCTION_PRIORITY.indexOf(second.name);
    })
    .forEach (function (query) {
        changedCollection = query(changedCollection);
    });

    return changedCollection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var fieldsToChoose = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (el) {
            return fieldsToChoose.reduce(function (newCollection, property) {
                if (el.hasOwnProperty(property)) {
                    newCollection[property] = el[property];
                }

                return newCollection;
            }, {});
        });
    };
};


/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        return collection.filter(function (el) {
            return values.indexOf(el[property]) !== -1;
        });
    };
};


/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {

    return function sortBy(collection) {
        var changedCollection = collection.sort(function (first, second) {

            return (first[property] > second[property]);
        });

        return order === 'asc' ? changedCollection : changedCollection.reverse();
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (el) {
            if (el.hasOwnProperty(property)) {
                el[property] = formatter(el[property]);
            }

            return el;
        });
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {
    return function limit(collection) {
        return collection.slice(0, count);
    };
};
