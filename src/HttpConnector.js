import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'
import qs from 'querystring'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Accept'] = 'application/json'

axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'

Vue.use(VueAxios, axios)

function httpDecorator (promise) {
  return promise.then(res => {
    console.log(res)
    if (res.status !== 200) {
      throw new Error('Network Error')
    }
    let result = res.data
    if (result.code !== 200) {
      throw new Error(result.code + ', ' + result.msg)
    }
    return result.data
  })
}

export default {
  role: {
    /**
     * @returns Promise
     */
    getRoleList: () => {
      return httpDecorator(axios.get(`/role/list`))
    },
    /**
     * @returns Promise
     */
    getRole: (id) => {
      return httpDecorator(axios.get(`/role/${id}`))
    },
    /**
     * @returns Promise
     */
    getRoleName: (id) => {
      return httpDecorator(axios.get(`/role/${id}/name`))
    },
  },
  type: {
    addType: (type = {}) => {
      return httpDecorator(axios.post(`/type`, type, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    deleteType: (id) => {
      return httpDecorator(axios.delete(`/type/${id}`))
    },
    updateType: (id, type = {}) => {
      return httpDecorator(axios.put(`/type/${id}`, type, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    getType: (id) => {
      return httpDecorator(axios.get(`/type/${id}`))
    },
    getTypeList: () => {
      return httpDecorator(axios.get(`/type/list`))
    },
    /**
     * @returns Promise
     */
    getCount: () => {
      return httpDecorator(axios.get(`/type/count`))
    },

  },
  image: {
    /**
     * @param imageInfo {country, position, type, ppi, locationX, locationY, gatherTime, gatherDuration, scale, fileUri}
     * @returns Promise
     */
    addImage: (imageInfo = {}) => {
      return httpDecorator(axios.post(`/image`, imageInfo, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    deleteImage: (id) => {
      return httpDecorator(axios.delete(`/image/${id}`))
    },
    /**
     * @param imageInfo {id, country, position, type, ppi, locationX, locationY, gatherTime, gatherDuration, scale, fileUri}
     * @returns Promise
     */
    updateImage: (id, imageInfo = {}) => {
      imageInfo.id = id
      return httpDecorator(axios.put(`/image/${id}`, imageInfo, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    getImageInfo: (id) => {
      return httpDecorator(axios.get(`/image/${id}`))
    },
    /**
     * @param filter {country, position, ppi, fromX, toX, fromY, toY, gatherTime, gatherDuration, scale}
     * @returns Promise
     */
    getImageInfoList: (params = {}) => {
      return httpDecorator(axios.post(`/image/list`, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    uploadImage: (formData) => {
      return httpDecorator(axios.post(`/image/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }))
    },
  },
  user: {
    /**
     * @param username string
     * @param password string
     * @returns Promise
     */
    login: (username, password) => {
      return httpDecorator(axios.put(`/user/login`, qs.stringify({username, password})))
    },
    /**
     * @param username string
     * @param password string
     * @returns Promise
     */
    getLoginID: () => {
      return httpDecorator(axios.get(`/user/login`))
    },
    /**
     * @param user {username, password, name, email}
     * @returns Promise
     */
    register: (user = {}) => {
      return httpDecorator(axios.post(`/user/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @returns Promise
     */
    logout: () => {
      return httpDecorator(axios.put(`/user/logout`))
    },
    /**
     * @param user {username, password, name}
     * @returns Promise
     */
    addUser: (user = {}) => {
      return httpDecorator(axios.post(`/user`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @param user {username, password, name}
     * @returns Promise
     */
    addAdmin: (user = {}) => {
      return httpDecorator(axios.post(`/user/admin`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    deleteUser: (id) => {
      return httpDecorator(axios.delete(`/user/${id}`))
    },
    /**
     * @param id integer
     * @param user {username, password, name}
     * @returns Promise
     */
    updateUser: (id, user = {}) => {
      user.id = id
      return httpDecorator(axios.put(`/user/${id}`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    getUser: (id) => {
      return httpDecorator(axios.get(`/user/${id}`))
    },
    /**
     * @param params { user, listParams }
     * @returns Promise
     */
    getUserList: (params = {}) => {
      return httpDecorator(axios.post(`/user/list`, params, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))
    },
    /**
     * @returns Promise
     */
    getCount: () => {
      return httpDecorator(axios.get(`/user/count`))
    },
  },
}
