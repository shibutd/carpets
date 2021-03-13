const isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

export const getFromLocalStorage = (name, defaultValue) => {
  let data

  if (window !== undefined) {
    try {
      data = JSON.parse(localStorage.getItem(name))
    } catch (error) {
      localStorage.removeItem(name)
    }
  }

  return data ?? defaultValue
}

export const removeFromLocalStorage = (name) => {
  if (window !== undefined) {
    localStorage.removeItem(name)
  }
}

export const saveToLocalStorage = (name, obj) => {
  if (window !== undefined) {
    localStorage.setItem(name, JSON.stringify(obj))
  }
}