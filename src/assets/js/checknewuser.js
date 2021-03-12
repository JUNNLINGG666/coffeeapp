import { Toast } from 'vant';

class Check {
    validation(msg){
        for(let key in msg){
            if(!msg[key].reg.test(msg[key].value)){
                Toast.fail({
                    message:msg[key].errorMsg,
                    duration:2000,
                    forbidClick:true,
                    overlay:true
                })
                return false
            }
        }
        Toast.success('注册成功')
        return true
    }
}

export const check = new Check();