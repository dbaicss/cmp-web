import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Nofind from './views/404'
import Home from './views/Home'
import FoundList from './views/FoundList'
import AuditList from './views/AuditList'
import PodList  from  './views/PodList'
// import WebSSH from './components/WebSSH'
import WebTerminal from  './views/WebTerminal'
import Login from './views/Login'
import Register from './views/Register'
import  LogList from './views/LogList'
import AssetList from './views/AssetList'
import ServerList from './views/ServerList'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '*', name: '/404', component: Nofind },
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
        {
            path: '/index',
            name: 'index',
            component: Index,
            children: [
                { path: '', component: Home },
                { path: '/home', name: 'home', component: Home },
                { path: '/foundlist', name: 'foundlist', component: FoundList },
                { path: '/assetlist', name: 'assetlist', component: AssetList },
                { path: '/serverlist', name: 'serverlist', component: ServerList },
                { path: '/auditlist', name: 'auditlist', component: AuditList },
                { path: '/podlist', name: 'podlist', component: PodList }
            ]
        },
        // {path: '/ssh?podNs=:namespace&podName=:pod', name: 'WebSSH', component: WebSSH},
        {path: '/ssh', name: 'Terminal', component: WebTerminal},
        {path: '/log', name: 'loglist', component: LogList},
        //{path: '/api/v1/namespaces/:namespace/pods/:pod/exec?command=sh&stderr=true&stdin=true&stdout=true&tty=true', name: 'pod', component: Xterm},
    ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.eleToken ? true : false;
    if (to.path == "/login" || to.path == "/register") {
        next();
    } else {
        //isLogin ? next() : next("/login");
        next()
    }
})

export default router;
 