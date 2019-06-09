import swal from 'sweetalert2';

export default {
    install: (Vue) => {
        // sweetalert2 的设置默认配置方法
        swal.setDefaults({
            confirmButtonText: '确定',
            confirmButtonColor: '#4bb44b'
        })

        // 添加全局方法
        Vue.swal = swal
        // 添加实例方法
        Vue.prototype.$swal = swal
    }
}