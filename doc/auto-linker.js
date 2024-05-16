/* eslint-disable jsdoc/require-param-description,jsdoc/require-returns-description */

const apiLinkBaseUrl = 'https://docs.yworks.com/yfileshtml/#'
const mdnSearchBaseUrl = 'https://developer.mozilla.org/search?q'
const mdnAPIBaseUrl = 'https://developer.mozilla.org/en-US/docs/Web/API/'

const typeNameRegex = /^([A-Z\d]+[a-z\d]+)+$/
const memberNameRegex = /^[a-z\d]+([A-Z\d]+[a-z\d]+)*$/
const constantNameRegex = /^[A-Z\d]+[A-Z_\d]*$/
const fqnRegex = /^([A-Z\d]+[a-z\d]+)+\.\w+$/

const excludeList = [
  'any',
  'boolean',
  'false',
  'main',
  'NaN',
  'null',
  'number',
  'object',
  'strict',
  'string',
  'this',
  'true',
  'undefined',
  'yfiles'
]

/**
 * Returns the type used in a related code element in this order:
 * If there is a code element with data-type attribute, use the type used in that element.
 * Otherwise, use the type of the first code element which is either a type name or a FQN.
 *
 * @param {Element} codeElement
 * @returns {string | undefined}
 */
const getTypeFromContext = codeElement => {
  const parent = codeElement.parentElement
  const typeElement = parent.querySelector('code[data-type]')

  const getTypeFromElementText = innerText =>
    innerText.match(typeNameRegex)
      ? innerText
      : innerText.match(fqnRegex)
      ? innerText.split('.').at(0)
      : undefined

  if (typeElement != null) {
    return getTypeFromElementText(typeElement.innerText)
  }

  for (const element of parent.querySelectorAll('code')) {
    const type = getTypeFromElementText(element.innerText)
    if (type != null) {
      return type
    }
  }
}

const getApiLink = (href, textContent) => {
  return `<a href="${apiLinkBaseUrl}/${href}" target="api-doc">${textContent}</a>`
}

/**
 * @param {Element} element
 * @param {string} apiName
 * @returns {string}
 */
const createApiLink = (element, apiName) => {
  if (element.hasAttribute('data-search')) {
    return getApiLink(`search/${apiName}`, apiName)
  }
  if (apiName.match(typeNameRegex) || apiName.match(fqnRegex)) {
    return getApiLink(`api/${apiName.replace('.', '#')}`, apiName)
  }
  if (apiName.match(memberNameRegex) || apiName.match(constantNameRegex)) {
    // Try to get the type from the context
    const type = getTypeFromContext(element)
    if (type != null) {
      return getApiLink(`api/${type}#${apiName}`, apiName)
    } else {
      console.log(`No type found for '${apiName}'`)
      return getApiLink(`search/${apiName}`, apiName)
    }
  }

  // Create a search link if this is at least an actual word
  // console.log(`Creating no link for '${apiName}'`)
  return apiName
}

const addLinks = () => {
  const rootElements = document.querySelector('.doc-root')
    ? document.querySelectorAll('.doc-root')
    : [document.body]
  for (const rootElement of rootElements) {
    rootElement.querySelectorAll('code').forEach(codeElement => {
      const innerText = codeElement.innerText
      try {
        if (
          codeElement.hasAttribute('data-no-link') ||
          excludeList.includes(codeElement.innerText)
        ) {
          return
        }
        if (codeElement.hasAttribute('data-mdn-api')) {
          codeElement.innerHTML = `<a href="${mdnAPIBaseUrl}${innerText}" target="_blank">${innerText}</a>`
        } else if (codeElement.hasAttribute('data-mdn')) {
          codeElement.innerHTML = `<a href="${mdnSearchBaseUrl}=${innerText}" target="_blank">${innerText}</a>`
        } else {
          codeElement.innerHTML = createApiLink(codeElement, innerText)
        }
      } catch (ignored) {
        console.log(`Failed to create link for '${innerText}'`)
      }
    })
  }
}

if (document.readyState !== 'loading') {
  addLinks()
} else {
  document.addEventListener('DOMContentLoaded', addLinks)
}
