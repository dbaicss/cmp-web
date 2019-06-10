import axios from 'axios';
import { Loading } from 'element-ui';
import { Message } from 'element-ui';
import router from './router'

let loading;   //加载动画
function startLoading() {
    loading = Loading.service({
        lock: true,  //锁定
        text: '拼命加载中...',   //loading时显示
        background: 'rgba(0,0,0,7)'
    })
}


function endLoading() {
    loading.close();
}
//请求拦截,加载动画
axios.interceptors.request.use(config => {
        //加载动画
        startLoading();
        if(localStorage.eleToken) {
            //设置http头
            config.headers.Authorization = localStorage.eleToken;
        }
        return config;
    },error => {
        return Promise.reject(error);    //返回错误
    }
);


//响应拦截,关闭动画
axios.interceptors.response.use(response => {
        //结束加载动画
        endLoading();
        return response;
    },error => {
        //错误提醒
        endLoading();
        Message.error(error.response.data);
        //获取状态码
        const {status} =  error.response;
        if (status==401) {  //状态码为401,表示token过期,删除过期token
            Message.error("token过期,请重新登录!");
            //清除token
            localStorage.removeItem("eleToken");
            router.push('/login');
        }
        return Promise.reject(error);
    }
);


export default  axios;
