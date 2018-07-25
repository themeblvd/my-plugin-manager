/**
 * Generate PHP class prefix.
 *
 * @param {string} name WordPress theme or plugin name.
 * @return {string}
 */
function classPrefix(name) {
  return name.replace(/ /gi, '_');
}

/**
 * Generate PHP class file prefix.
 *
 * @param {string} name WordPress theme or plugin name.
 * @return {string}
 */
function classFilePrefix(name) {
  let prefix = classPrefix(name);
  prefix = prefix.toLowerCase().replace(/_/gi, '-');
  prefix = `class-${prefix}-`;
  return prefix;
}

module.exports = { classPrefix, classFilePrefix };
