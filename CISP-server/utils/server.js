// 与服务器响应相关的函数
const baseSend = (code = 200, msg = '', data = null) => {
    return {
        code,
        msg,
        data
    }
};

// 读取请求体
const readReqData = (req) => new Promise((resolve, reject) => {
    let str = '';
    req.on('data', (data) => {
        str += data.toString();
    });
    req.on('end', () => {
        resolve(JSON.parse(str))
    })
});

module.exports = {
    baseSend,
    readReqData,
    /**
     * 通用的响应需要验证的方法
     * @param {*} req 请求对象
     * @param {*} res 响应对象
     * @param {*} instance 模型实例
     * @param {*} validateFunc 参数验证方法
     * @param {*} action 针对模型的动作，如：create、update
     * @param {*} filterCallback 过滤的回调，可能会有二次过滤
     * @param {*} modelOption 调用模型方法传递的第二个参数
     * @returns
     */
    async commonVaildate(req, res, instance, validateFunc, action, filterCallback, modelOption = {}) {
        async function _vaildate(item) {
            let yetOver = true;
            filterCallback && (yetOver = await filterCallback(item));
            return yetOver;
        }
        // 剔除不需要的键值对
        let params = await readReqData(req);
        if (Array.isArray(params)) {
            let filter = [];
            // 剔除不需要的键值对
            for (let index = 0; index < params.length; index++) {
                const item = await validateFunc(params[index]);
                if (!item) {
                    // 检测不通过
                    res.send(baseSend(417, `传递的信息数量与预期的不一致`));
                    return false;
                }
                filter.push(item);
                const result = await _vaildate(item);
                if (!result) {
                    return false;
                }
            }
            params = filter;
        }
        else {
            params = await validateFunc(params);
            if (!params) {
                // 检测不通过
                res.send(baseSend(417, `传递的信息数量与预期的不一致`));
                return false;
            }
            const result = await _vaildate(params);
            if (!result) {
                return false;
            }
        }
        const result = await instance[action](params, modelOption).catch(err => {
            res.send(baseSend(417, `传入的数据类型验证未通过，${err.name}`));
            return false
        });
        return result;
    }
}