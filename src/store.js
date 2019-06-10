import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


const types = {
    SET_AUTHENTICATED:'SET_AUTHENTICATED', //判断是否认证通过
    SET_USER : 'SET_USER',  //判断用户
};

const state = {
    isAuthenticated:false,   //是否授权
    user:{}                  //授权通过后user信息
};

//获取状态信息
const  getters = {
    isAuthenticated: state => state.isAuthenticated,    //获取state对象中字段信息
    user: state => state.user
};

//更改状态信息
const  mutations = {
    [types.SET_AUTHENTICATED](state,isAuthenticated) {  //[types.SET_AUTHENTICATED](state,isAuthenticated)表示类型为SET_AUTHENTICATED,
        // 参数为state,isAuthenticated这2个的函数
        if (isAuthenticated) state.isAuthenticated = isAuthenticated;  //isAuthenticated为真,就把state.isAuthenticated设置为真
        else state.isAuthenticated = false; //否则,设置为false
    },
    [types.SET_USER](state,user) {
        if (user) state.user = user;    //user存在,就赋值
        else state.user = {};   //不存在,赋值成空对象
    }
};

//异步调用
const actions = {
    setIsAutnenticated: ({commit},isAuthenticated) => {
        commit(types.SET_AUTHENTICATED,isAuthenticated);    //commit通过diaptach提交
    },
    setUser:({commit},user) => {
        commit(types.SET_USER,user);
    },
    clearCurrentState: ({commit}) => {
        commit(types.SET_AUTHENTICATED,false);  //设置authenticated为false,非授权
        commit(types.SET_USER,null);
    },
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})

