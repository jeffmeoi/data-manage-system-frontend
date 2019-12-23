import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'
import qs from 'querystring'
import { jxios } from 'jxios'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Accept'] = 'application/json'

axios.defaults.withCredentials = true
axios.defaults.baseURL = '/api'

Vue.use(VueAxios, axios)

function requestDecorator (promise) {
  return promise.then(res => {
    console.log(res)
    res = res[res.fetchType]
    if (res.status !== 200) {
      throw new Error('Network Error')
    }
    let result = res.data
    if (result.code !== 200) {
      throw new Error(result.code + '@' + result.msg)
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
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/role/list`
        },
        type: 'mutable'
      }))
    },
    /**
     * @returns Promise
     */
    getRole: (id) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/role/${id}`
        },
        type: 'mutable'
      }))
    },
    /**
     * @returns Promise
     */
    getRoleName: (id) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/role/${id}/name`
        },
        type: 'mutable'
      }))
      // return requestDecorator(axios.get(`/role/${id}/name`))
    },
  },
  type: {
    addType: (type = {}) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'post',
          url: `/type`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: type
        },
        type: 'normal'
      }))
    },
    deleteType: (id) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'delete',
          url: `/type/${id}`,
        },
        type: 'normal'
      }))
    },
    updateType: (id, type = {}) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'put',
          url: `/type/${id}`,
          data: type,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        type: 'normal'
      }))
    },
    getType: (id) => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/type/${id}`,
        },
        type: 'mutable'
      }))
    },
    getTypeList: () => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/type/list`,
        },
        type: 'mutable'
      }))
    },
    /**
     * @returns Promise
     */
    getCount: () => {
      return requestDecorator(jxios.request({
        requestConfig: {
          method: 'get',
          url: `/type/count`,
        },
        type: 'mutable'
      }))
      // return requestDecorator(axios.get(`/type/count`))
    },
    /**
     * @param formData
     */
    addTypes: (formData) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/type/batch`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        }
      }))
    },
  },
  image: {
    /**
     * @param imageInfo {country, position, type, ppi, locationX, locationY, gatherTime, gatherDuration, scale, fileUri}
     * @returns Promise
     */
    addImage: (imageInfo = {}) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/image`,
          data: imageInfo,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    deleteImage: (id) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'delete',
          url: `/image/${id}`,
        }
      }))
      // return requestDecorator(axios.delete(`/image/${id}`))
    },
    /**
     * @param imageInfo {id, country, position, type, ppi, locationX, locationY, gatherTime, gatherDuration, scale, fileUri}
     * @returns Promise
     */
    updateImage: (id, imageInfo = {}) => {
      imageInfo.id = id
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'put',
          url: `/image/${id}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: imageInfo
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    getImageInfo: (id) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'get',
          url: `/image/${id}`
        }
      }))
    },
    /**
     * @param filter {country, position, ppi, fromX, toX, fromY, toY, gatherTime, gatherDuration, scale}
     * @returns Promise
     */
    getImageInfoList: (params = {}) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'post',
          url: `/image/list`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: params
        }
      }))
    },
    /**
     * @param formData
     */
    uploadImage: (formData) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'post',
          url: `/image/upload`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        }
      }))
    },
    /**
     * @param formData
     */
    addImages: (formData) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/image/batch`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
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
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'put',
          url: `/user/login`,
          data: qs.stringify({username, password})
        }
      }))
    },
    /**
     * @param username string
     * @param password string
     * @returns Promise
     */
    getLoginID: () => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'get',
          url: `/user/login`,
        }
      }))
    },
    /**
     * @param user {username, password, name, email}
     * @returns Promise
     */
    register: (user = {}) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'post',
          url: `/user/register`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: user
        }
      }))
    },
    /**
     * @returns Promise
     */
    logout: () => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'put',
          url: `/user/logout`,
        }
      }))
    },
    /**
     * @param user {username, password, name}
     * @returns Promise
     */
    addUser: (user = {}) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/user`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: user
        }
      }))
    },
    /**
     * @param formData
     */
    addUsers: (formData) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/user/batch`,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: formData
        }
      }))
    },
    /**
     * @param user {username, password, name}
     * @returns Promise
     */
    addAdmin: (user = {}) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'post',
          url: `/user/admin`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: user
        }
      }))
    },
    deleteUser: (id) => {
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'delete',
          url: `/user/${id}`,
        }
      }))
    },
    /**
     * @param id integer
     * @param user {username, password, name}
     * @returns Promise
     */
    updateUser: (id, user = {}) => {
      user.id = id
      return requestDecorator(jxios.request({
        type: 'normal',
        requestConfig: {
          method: 'put',
          url: `/user/${id}`,
          data: user,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }))
    },
    /**
     * @param id integer
     * @returns Promise
     */
    getUser: (id) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'get',
          url: `/user/${id}`,
        }
      }))
    },
    /**
     * @param params { user, listParams }
     * @returns Promise
     */
    getUserList: (params = {}) => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'post',
          url: `/user/list`,
          data: params,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }))
    },
    /**
     * @returns Promise
     */
    getCount: () => {
      return requestDecorator(jxios.request({
        type: 'mutable',
        requestConfig: {
          method: 'get',
          url: `/user/count`,
        }
      }))
    },
  },
}
